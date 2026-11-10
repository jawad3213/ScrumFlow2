package com.scrumflow.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import com.scrumflow.backend.config.AppProperties;
import com.scrumflow.backend.domain.RefreshToken;
import com.scrumflow.backend.domain.TimestampedEntity;
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.RefreshTokenRepository;

/**
 * Issues and checks the two tokens of a session.
 * <ul>
 *   <li>Access token: a JWT (HS256, signed with JWT_SECRET) valid for 15 minutes, returned in the
 *       response body and kept in memory by the frontend. Checked without a database lookup.</li>
 *   <li>Refresh token: 64 random chars in an HttpOnly cookie, valid for 30 days and rotated on every
 *       use; refresh_tokens stores its sha256, so it can be revoked at any time.</li>
 * </ul>
 */
@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    public static final int ACCESS_TOKEN_MINUTES = 15;
    public static final int REFRESH_TOKEN_DAYS = 30;
    public static final String REFRESH_COOKIE = "refresh_token";
    public static final String ISSUER = "scrumflow";
    /** Issue time in milliseconds: "iat" has second precision, too coarse to order a token and a revocation. */
    private static final String ISSUED_AT_MILLIS = "iat_ms";

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    /** HS256 needs a key of at least 256 bits. */
    private static final int MIN_SECRET_BYTES = 32;

    private final RefreshTokenRepository refreshTokens;
    private final boolean cookieSecure;
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    /** Access tokens ended by logout (jti -> expiry), refused until they would have expired anyway. */
    private final Map<String, Instant> revoked = new ConcurrentHashMap<>();
    /** Users whose sessions were all ended (user id -> when): their older access tokens are refused. */
    private final Map<Long, Instant> sessionsEndedAt = new ConcurrentHashMap<>();

    public TokenService(RefreshTokenRepository refreshTokens, AppProperties props) {
        this.refreshTokens = refreshTokens;
        this.cookieSecure = props.cookieSecure();
        SecretKey key = signingKey(props.jwtSecret());
        this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        NimbusJwtDecoder nimbus = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        nimbus.setJwtValidator(JwtValidators.createDefaultWithIssuer(ISSUER));
        this.decoder = nimbus;
    }

    private static SecretKey signingKey(String secret) {
        byte[] bytes;
        if (secret == null || secret.isBlank()) {
            // Still secure, but access tokens stop working at each restart (the frontend then refreshes)
            log.warn("[Auth] JWT_SECRET is not set: using a random key for this run");
            bytes = new byte[MIN_SECRET_BYTES];
            RANDOM.nextBytes(bytes);
        } else {
            bytes = secret.getBytes(StandardCharsets.UTF_8);
            if (bytes.length < MIN_SECRET_BYTES) {
                throw new IllegalStateException("JWT_SECRET must be at least " + MIN_SECRET_BYTES + " bytes long");
            }
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    /** Laravel's Str::random(): random alphanumeric characters. */
    public static String randomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }

    public static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(String.valueOf(user.id))
                .issuedAt(now)
                .expiresAt(now.plus(ACCESS_TOKEN_MINUTES, ChronoUnit.MINUTES))
                .id(UUID.randomUUID().toString())
                .claim(ISSUED_AT_MILLIS, now.toEpochMilli())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    /** Checks the bearer JWT: signature, issuer, expiry, and that it was not ended by logout. */
    public Optional<AuthUser> authenticate(String bearer) {
        if (bearer == null || bearer.isBlank()) {
            return Optional.empty();
        }
        try {
            Jwt jwt = decoder.decode(bearer);
            Long userId = Long.valueOf(jwt.getSubject());
            if (jwt.getId() == null || revoked.containsKey(jwt.getId())) {
                return Optional.empty();
            }
            Instant endedAt = sessionsEndedAt.get(userId);
            if (endedAt != null && !(jwt.getClaim(ISSUED_AT_MILLIS) instanceof Number issued
                    && issued.longValue() >= endedAt.toEpochMilli())) {
                return Optional.empty();
            }
            return Optional.of(new AuthUser(userId, jwt.getId(), jwt.getExpiresAt()));
        } catch (JwtException | NumberFormatException e) {
            return Optional.empty();
        }
    }

    public void revokeAccessToken(AuthUser user) {
        Instant now = Instant.now();
        revoked.values().removeIf(expiry -> expiry.isBefore(now));
        revoked.put(user.tokenId(), user.expiresAt());
    }

    /**
     * Ends every session of the user (after a password change): deletes their refresh tokens and
     * refuses the access tokens issued until now.
     */
    @Transactional
    public void revokeAllSessions(Long userId) {
        Instant now = Instant.now();
        sessionsEndedAt.values().removeIf(at -> at.plus(ACCESS_TOKEN_MINUTES, ChronoUnit.MINUTES).isBefore(now));
        sessionsEndedAt.put(userId, now);
        refreshTokens.deleteAllForUser(userId);
    }

    /** Creates a refresh token row and returns the raw value for the cookie. */
    @Transactional
    public String createRefreshToken(User user) {
        String raw = randomString(64);
        RefreshToken token = new RefreshToken();
        token.userId = user.id;
        token.token = sha256(raw);
        token.expiresAt = TimestampedEntity.now().plusDays(REFRESH_TOKEN_DAYS);
        refreshTokens.save(token);
        return raw;
    }

    /** The HttpOnly cookie carrying a refresh token. */
    public ResponseCookie refreshCookie(String raw) {
        return ResponseCookie.from(REFRESH_COOKIE, raw)
                .path("/")
                .maxAge(Duration.ofDays(REFRESH_TOKEN_DAYS))
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .build();
    }

    public Optional<RefreshToken> findRefreshToken(String raw) {
        return refreshTokens.findFirstByToken(sha256(raw));
    }

    @Transactional
    public void deleteRefreshToken(RefreshToken token) {
        refreshTokens.delete(token);
    }

    @Transactional
    public void revokeRefreshToken(String raw) {
        refreshTokens.deleteByTokenHash(sha256(raw));
    }
}
