package com.scrumflow.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.scrumflow.backend.security.FirebaseTokenVerifier.FirebaseIdentity;

/** Tokens signed with a local key stand in for Google's, so the checks run without the network. */
class FirebaseTokenVerifierTest {

    private static final String PROJECT = "scrumflow-test";
    private static final KeyPair GOOGLE_KEY = rsaKeyPair();
    private static final KeyPair OTHER_KEY = rsaKeyPair();

    private final FirebaseTokenVerifier verifier = new FirebaseTokenVerifier(
            NimbusJwtDecoder.withPublicKey((RSAPublicKey) GOOGLE_KEY.getPublic()).build(), PROJECT);

    private static KeyPair rsaKeyPair() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            return generator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static JWTClaimsSet.Builder validClaims() {
        Instant now = Instant.now();
        return new JWTClaimsSet.Builder()
                .issuer("https://securetoken.google.com/" + PROJECT)
                .audience(PROJECT)
                .subject("firebase-uid-1")
                .issueTime(Date.from(now.minusSeconds(60)))
                .expirationTime(Date.from(now.plusSeconds(3600)))
                .claim("email", "ana@example.com")
                .claim("email_verified", true);
    }

    private static String sign(JWTClaimsSet claims, KeyPair key) {
        try {
            SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.RS256), claims);
            jwt.sign(new RSASSASigner(key.getPrivate()));
            return jwt.serialize();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Test
    void acceptsTokenForTheProject() {
        assertThat(verifier.verify(sign(validClaims().build(), GOOGLE_KEY)))
                .contains(new FirebaseIdentity("firebase-uid-1", "ana@example.com", true));
    }

    @Test
    void rejectsForgedOrMisdirectedTokens() {
        Instant past = Instant.now().minusSeconds(7200);
        assertThat(verifier.verify(sign(validClaims().build(), OTHER_KEY))).isEmpty();
        assertThat(verifier.verify(sign(validClaims().audience("another-project").build(), GOOGLE_KEY))).isEmpty();
        assertThat(verifier.verify(sign(validClaims().issuer("https://securetoken.google.com/another-project").build(), GOOGLE_KEY))).isEmpty();
        assertThat(verifier.verify(sign(validClaims().issueTime(Date.from(past))
                .expirationTime(Date.from(past.plusSeconds(3600))).build(), GOOGLE_KEY))).isEmpty();
        assertThat(verifier.verify(sign(validClaims().subject(null).build(), GOOGLE_KEY))).isEmpty();
        assertThat(verifier.verify("not-a-jwt")).isEmpty();
        assertThat(verifier.verify("")).isEmpty();
    }

    @Test
    void reportsUnverifiedEmail() {
        assertThat(verifier.verify(sign(validClaims().claim("email_verified", false).build(), GOOGLE_KEY)))
                .hasValueSatisfying(identity -> assertThat(identity.emailVerified()).isFalse());
    }
}
