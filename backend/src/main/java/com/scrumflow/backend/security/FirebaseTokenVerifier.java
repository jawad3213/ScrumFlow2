package com.scrumflow.backend.security;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.scrumflow.backend.config.AppProperties;

/**
 * Checks the ID token Firebase gives the frontend after Google sign-in, as the Firebase Admin SDK's
 * verifyIdToken() does: RS256 signature from Google's published keys, issuer and audience equal to
 * the Firebase project, not expired, and a non-empty subject (the Firebase uid).
 */
@Service
public class FirebaseTokenVerifier {

    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenVerifier.class);
    private static final String JWK_SET_URI =
            "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

    /** The verified facts the backend may trust; everything else in the request is client-supplied. */
    public record FirebaseIdentity(String uid, String email, boolean emailVerified) {
    }

    private final JwtDecoder decoder;

    @Autowired
    public FirebaseTokenVerifier(AppProperties props) {
        this(NimbusJwtDecoder.withJwkSetUri(JWK_SET_URI).build(), props.firebaseProjectId());
    }

    /** Takes the decoder holding the signing keys, so tests can sign tokens with their own key. */
    FirebaseTokenVerifier(NimbusJwtDecoder nimbus, String projectId) {
        nimbus.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer("https://securetoken.google.com/" + projectId),
                new JwtClaimValidator<List<String>>("aud", aud -> aud != null && aud.contains(projectId)),
                new JwtClaimValidator<String>("sub", sub -> sub != null && !sub.isBlank())));
        this.decoder = nimbus;
    }

    public Optional<FirebaseIdentity> verify(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            return Optional.empty();
        }
        try {
            Jwt jwt = decoder.decode(idToken);
            return Optional.of(new FirebaseIdentity(jwt.getSubject(), jwt.getClaimAsString("email"),
                    Boolean.TRUE.equals(jwt.getClaimAsBoolean("email_verified"))));
        } catch (JwtException e) {
            log.warn("[Auth] Rejected Firebase ID token: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
