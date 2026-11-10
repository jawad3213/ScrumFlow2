package com.scrumflow.backend.web;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scrumflow.backend.config.AppProperties;
import com.scrumflow.backend.domain.RefreshToken;
import com.scrumflow.backend.domain.TimestampedEntity;
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.security.FirebaseTokenVerifier;
import com.scrumflow.backend.security.FirebaseTokenVerifier.FirebaseIdentity;
import com.scrumflow.backend.security.TokenService;
import com.scrumflow.backend.service.DemoDataService;
import com.scrumflow.backend.service.MailService;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Validation;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    /** Same lifetime as Laravel's default password broker (auth.passwords.users.expire). */
    static final int RESET_TOKEN_MINUTES = 60;

    private final UserRepository users;
    private final TokenService tokens;
    private final PasswordEncoder passwords;
    private final Validation validation;
    private final Views views;
    private final DemoDataService demoData;
    private final MailService mail;
    private final JdbcTemplate jdbc;
    private final AppProperties props;
    private final FirebaseTokenVerifier firebase;

    public AuthController(UserRepository users, TokenService tokens, PasswordEncoder passwords, Validation validation,
                          Views views, DemoDataService demoData, MailService mail, JdbcTemplate jdbc,
                          AppProperties props, FirebaseTokenVerifier firebase) {
        this.users = users;
        this.tokens = tokens;
        this.passwords = passwords;
        this.validation = validation;
        this.views = views;
        this.demoData = demoData;
        this.mail = mail;
        this.jdbc = jdbc;
        this.props = props;
        this.firebase = firebase;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(Input in) {
        validation.make(in).rule("email", "required|email").rule("password", "required").validate();

        Optional<User> found = users.findFirstByEmail(in.str("email"));
        boolean valid = found.isPresent() && found.get().password != null
                && in.get("password") instanceof String password
                && passwords.matches(password, found.get().password);
        if (!valid) {
            throw ApiException.of(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }
        return sessionResponse(found.get(), "Connexion réussie");
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Map<String, Object>> register(Input in) {
        validation.make(in)
                .rule("first_name", "required|string|max:255")
                .rule("last_name", "required|string|max:255")
                .rule("email", "required|email|unique:users,email")
                .rule("password", Validation.NEW_PASSWORD)
                .validate();

        User user = new User();
        user.firstName = in.str("first_name");
        user.lastName = in.str("last_name");
        user.email = in.str("email");
        user.password = passwords.encode(in.str("password"));
        user.role = "chef";
        users.save(user);
        demoData.seedForUser(user);

        return sessionResponse(user, "Inscription réussie");
    }

    /**
     * Google sign-in through Firebase on the frontend. The Firebase ID token is verified, and the
     * account is matched by its uid (google_id), then by its verified email; the google_id and email
     * fields of the request are ignored, since anyone can send any value there.
     */
    @PostMapping("/auth/google")
    @Transactional
    public ResponseEntity<Map<String, Object>> googleLogin(Input in) {
        FirebaseIdentity identity = verifyGoogle(in);
        User user = users.findFirstByGoogleId(identity.uid()).orElse(null);
        if (user == null) {
            user = users.findFirstByEmail(identity.email()).orElseThrow(() -> ApiException.of(HttpStatus.NOT_FOUND,
                    "Utilisateur introuvable. Veuillez vous inscrire d'abord."));
            user.googleId = identity.uid();
            if (in.get("avatar") != null && user.avatar == null) {
                user.avatar = in.str("avatar");
            }
            users.save(user);
        }
        return sessionResponse(user, "Connexion Google réussie");
    }

    @PostMapping("/auth/google/register")
    @Transactional
    public ResponseEntity<Map<String, Object>> googleRegister(Input in) {
        FirebaseIdentity identity = verifyGoogle(in);
        if (users.findFirstByGoogleIdOrEmail(identity.uid(), identity.email()).isPresent()) {
            throw ApiException.of(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email. Veuillez vous connecter.");
        }
        User user = new User();
        user.firstName = in.get("first_name") != null ? in.str("first_name") : "User";
        user.lastName = in.get("last_name") != null ? in.str("last_name") : "";
        user.email = identity.email();
        user.googleId = identity.uid();
        user.avatar = in.str("avatar");
        user.password = null;
        user.role = "chef";
        users.save(user);
        demoData.seedForUser(user);

        return sessionResponse(user, "Inscription Google réussie");
    }

    /** Exchanges the refresh-token cookie for a new access token, rotating the refresh token. */
    @PostMapping("/refresh-token")
    @Transactional
    public ResponseEntity<Map<String, Object>> refreshToken(
            @CookieValue(name = TokenService.REFRESH_COOKIE, required = false) String raw) {
        log.info("[Auth] Refresh token request received (has_cookie={})", raw != null && !raw.isEmpty());
        if (raw == null || raw.isEmpty()) {
            throw ApiException.of(HttpStatus.UNAUTHORIZED, "Token de rafraîchissement absent.");
        }
        RefreshToken record = tokens.findRefreshToken(raw).orElse(null);
        if (record == null || record.isExpired()) {
            log.warn("[Auth] Refresh token invalid or expired");
            throw ApiException.of(HttpStatus.UNAUTHORIZED, "Token de rafraîchissement invalide ou expiré.");
        }
        log.info("[Auth] Token validated, rotating session for User: {}", record.userId);
        User user = users.findById(record.userId).orElseThrow(() ->
                ApiException.of(HttpStatus.UNAUTHORIZED, "Token de rafraîchissement invalide ou expiré."));

        tokens.deleteRefreshToken(record);
        String newRefresh = tokens.createRefreshToken(user);
        String access = tokens.createAccessToken(user);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(newRefresh).toString())
                .body(Json.obj("access_token", access, "token_type", "Bearer"));
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<Map<String, Object>> logout(@AuthenticationPrincipal AuthUser me,
            @CookieValue(name = TokenService.REFRESH_COOKIE, required = false) String raw) {
        tokens.revokeAccessToken(me);
        if (raw != null && !raw.isEmpty()) {
            tokens.revokeRefreshToken(raw);
        }
        ResponseCookie forget = ResponseCookie.from(TokenService.REFRESH_COOKIE, "")
                .path("/").maxAge(0).httpOnly(true).secure(props.cookieSecure()).sameSite("Lax").build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, forget.toString())
                .body(Json.obj("message", "Déconnexion réussie"));
    }

    /**
     * Sends a reset link when the account exists. The answer is the same either way, so the endpoint
     * cannot be used to find out which emails have an account.
     */
    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(Input in) {
        validation.make(in).rule("email", "required|email").validate();
        String email = in.str("email");
        if (users.findFirstByEmail(email).isPresent()) {
            // Only the hash is stored: a leaked database gives no usable reset links
            String token = TokenService.randomString(60);
            jdbc.update("""
                    insert into password_reset_tokens (email, token, created_at) values (?, ?, ?)
                    on conflict (email) do update set token = excluded.token, created_at = excluded.created_at
                    """, email, TokenService.sha256(token), TimestampedEntity.now());
            try {
                mail.sendPasswordReset(email, token);
            } catch (Exception e) {
                log.error("[Mail] Password reset e-mail to {} failed", email, e);
                throw ApiException.of(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de l'envoi de l'email.");
            }
        }
        return Json.obj("message", "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
    }

    /** Sets the new password with a reset token at most RESET_TOKEN_MINUTES old, and ends every session. */
    @PostMapping("/reset-password")
    @Transactional
    public Map<String, Object> resetPassword(Input in) {
        validation.make(in)
                .rule("email", "required|email")
                .rule("token", "required|string")
                .rule("password", Validation.NEW_PASSWORD)
                .validate();
        String email = in.str("email");
        Map<String, Object> reset = jdbc.queryForList(
                "select token, created_at from password_reset_tokens where email = ?", email)
                .stream().findFirst().orElse(null);
        boolean valid = reset != null
                && reset.get("created_at") instanceof java.sql.Timestamp created
                && created.toLocalDateTime().isAfter(TimestampedEntity.now().minusMinutes(RESET_TOKEN_MINUTES))
                && MessageDigest.isEqual(
                        String.valueOf(reset.get("token")).getBytes(StandardCharsets.US_ASCII),
                        TokenService.sha256(in.str("token")).getBytes(StandardCharsets.US_ASCII));
        User user = users.findFirstByEmail(email).orElse(null);
        if (!valid || user == null) {
            throw ApiException.of(HttpStatus.BAD_REQUEST, "Token invalide, expiré ou email incorrect.");
        }
        user.password = passwords.encode(in.str("password"));
        users.save(user);
        jdbc.update("delete from password_reset_tokens where email = ?", email);
        // Whoever knew the old password may hold a session: end them all
        tokens.revokeAllSessions(user.id);
        return Json.obj("message", "Mot de passe réinitialisé avec succès.");
    }

    /** Token check endpoint: the authenticated user. */
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal AuthUser me) {
        return views.user(users.findById(me.userId()).orElseThrow());
    }

    /** Validates the request and returns the identity proven by its Firebase ID token. */
    private FirebaseIdentity verifyGoogle(Input in) {
        validation.make(in)
                .rule("id_token", "required|string")
                .rule("first_name", "nullable|string|max:255")
                .rule("last_name", "nullable|string|max:255")
                .rule("avatar", "nullable|string")
                .validate();
        FirebaseIdentity identity = firebase.verify(in.str("id_token")).orElseThrow(() ->
                ApiException.of(HttpStatus.UNAUTHORIZED, "Jeton Google invalide ou expiré."));
        // Accounts are linked by email, so it must be one Google has confirmed belongs to the user
        if (identity.email() == null || !identity.emailVerified()) {
            throw ApiException.of(HttpStatus.UNAUTHORIZED, "L'adresse email du compte Google n'est pas vérifiée.");
        }
        return identity;
    }

    /** Login-style response: a 15-minute access JWT in the body and the refresh token as a cookie. */
    private ResponseEntity<Map<String, Object>> sessionResponse(User user, String message) {
        String access = tokens.createAccessToken(user);
        String refresh = tokens.createRefreshToken(user);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(refresh).toString())
                .body(Json.obj(
                        "message", message,
                        "access_token", access,
                        "token_type", "Bearer",
                        "user", views.user(user),
                        "role", user.role));
    }

    private ResponseCookie refreshCookie(String value) {
        return tokens.refreshCookie(value);
    }
}
