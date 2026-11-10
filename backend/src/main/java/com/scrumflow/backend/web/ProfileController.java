package com.scrumflow.backend.web;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.scrumflow.backend.config.AppProperties;
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.security.TokenService;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Validator;

/** The authenticated user's own profile, password and avatar. */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private static final long MAX_AVATAR_KB = 2048;

    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final Validation validation;
    private final Views views;
    private final TokenService tokens;
    private final Path storageRoot;

    public ProfileController(UserRepository users, PasswordEncoder passwords, Validation validation, Views views,
                             TokenService tokens, AppProperties props) {
        this.users = users;
        this.passwords = passwords;
        this.validation = validation;
        this.views = views;
        this.tokens = tokens;
        this.storageRoot = Path.of(props.storagePath()).toAbsolutePath().normalize();
    }

    @GetMapping
    public Map<String, Object> index(@AuthenticationPrincipal AuthUser me) {
        return views.userWithSpecialization(current(me));
    }

    @PostMapping
    @Transactional
    public Map<String, Object> update(@AuthenticationPrincipal AuthUser me, Input in) {
        validation.make(in)
                .rule("first_name", "required|string|max:255")
                .rule("last_name", "required|string|max:255")
                .validateErrorsOnly();
        User user = current(me);
        user.firstName = in.str("first_name");
        user.lastName = in.str("last_name");
        users.saveAndFlush(user);
        return Json.obj("message", "Profil mis à jour avec succès.", "user", views.user(user));
    }

    /**
     * Changes the password; the current one is only required when the account already has one.
     * Every session of the account ends (a stolen one included), and this browser gets a new one:
     * a fresh refresh cookie, and the access token in the body.
     */
    @PostMapping("/password")
    @Transactional
    public ResponseEntity<Map<String, Object>> updatePassword(@AuthenticationPrincipal AuthUser me, Input in) {
        User user = current(me);
        boolean hasPassword = user.password != null;
        Validator v = validation.make(in).rule("new_password", Validation.NEW_PASSWORD);
        if (hasPassword) {
            v.rule("current_password", "required");
        }
        v.validateErrorsOnly();

        if (hasPassword && !(in.get("current_password") instanceof String current && passwords.matches(current, user.password))) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, Json.obj("errors",
                    Json.obj("current_password", java.util.List.of("Le mot de passe actuel est incorrect."))));
        }
        user.password = passwords.encode(in.str("new_password"));
        users.save(user);

        tokens.revokeAllSessions(user.id);
        String refresh = tokens.createRefreshToken(user);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, tokens.refreshCookie(refresh).toString())
                .body(Json.obj("message", "Mot de passe mis à jour avec succès.",
                        "access_token", tokens.createAccessToken(user), "token_type", "Bearer"));
    }

    /** Stores the image under storage/avatars/ and replaces the previous one. */
    @PostMapping("/avatar")
    @Transactional
    public Map<String, Object> updateAvatar(@AuthenticationPrincipal AuthUser me,
            @RequestParam(name = "avatar", required = false) MultipartFile avatar) throws IOException {
        Validator v = validation.make(Map.of());
        String extension = null;
        if (avatar == null || avatar.isEmpty()) {
            v.addError("avatar", "The avatar field is required.");
        } else {
            ImageType type = ImageType.detect(avatar);
            if (type == null) {
                v.addError("avatar", "The avatar field must be an image.");
            }
            if (type == null || !type.allowed) {
                v.addError("avatar", "The avatar field must be a file of type: jpeg, png, jpg, gif.");
            } else {
                extension = type.extension;
            }
            if (avatar.getSize() > MAX_AVATAR_KB * 1024) {
                v.addError("avatar", "The avatar field must not be greater than " + MAX_AVATAR_KB + " kilobytes.");
            }
        }
        v.validate();

        User user = current(me);
        if (user.avatar != null) {
            Path old = storageRoot.resolve(user.avatar).normalize();
            if (old.startsWith(storageRoot.resolve("avatars"))) {
                Files.deleteIfExists(old);
            }
        }
        String path = "avatars/" + TokenService.randomString(40) + "." + extension;
        Path target = storageRoot.resolve(path);
        Files.createDirectories(target.getParent());
        try (InputStream in = avatar.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
        user.avatar = path;
        users.save(user);

        String url = ServletUriComponentsBuilder.fromCurrentContextPath().path("/storage/" + path).toUriString();
        return Json.obj("message", "Photo de profil mise à jour.", "avatar", path, "avatar_url", url);
    }

    private User current(AuthUser me) {
        return users.findById(me.userId()).orElseThrow();
    }

    /** Image type from the file's magic bytes (Laravel guessed it from the content too). */
    private enum ImageType {
        JPEG("jpg", true), PNG("png", true), GIF("gif", true), WEBP("webp", false), BMP("bmp", false);

        final String extension;
        final boolean allowed;

        ImageType(String extension, boolean allowed) {
            this.extension = extension;
            this.allowed = allowed;
        }

        static ImageType detect(MultipartFile file) throws IOException {
            byte[] h;
            try (InputStream in = file.getInputStream()) {
                h = in.readNBytes(12);
            }
            if (h.length >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) {
                return JPEG;
            }
            if (h.length >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') {
                return PNG;
            }
            if (h.length >= 4 && h[0] == 'G' && h[1] == 'I' && h[2] == 'F' && h[3] == '8') {
                return GIF;
            }
            if (h.length >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                    && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') {
                return WEBP;
            }
            if (h.length >= 2 && h[0] == 'B' && h[1] == 'M') {
                return BMP;
            }
            return null;
        }
    }
}
