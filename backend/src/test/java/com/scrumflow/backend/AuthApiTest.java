package com.scrumflow.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.PlainJWT;
import com.nimbusds.jwt.SignedJWT;

import com.scrumflow.backend.security.FirebaseTokenVerifier;
import com.scrumflow.backend.security.FirebaseTokenVerifier.FirebaseIdentity;
import com.scrumflow.backend.security.TokenService;
import com.scrumflow.backend.service.MailService;

class AuthApiTest extends ApiTestBase {

    @Autowired
    private JdbcTemplate jdbc;

    /** Google's keys are not reachable from tests: what a token proves is set per test. */
    @MockitoBean
    private FirebaseTokenVerifier firebase;

    /** Captures reset links instead of sending e-mails. */
    @MockitoBean
    private MailService mail;

    @Test
    void googleLoginTrustsOnlyTheVerifiedToken() {
        String victim = uniqueEmail("victim");
        register(victim);
        String uid = "uid-" + UUID.randomUUID();

        // A made-up token with the victim's email in the body is refused
        when(firebase.verify("forged")).thenReturn(Optional.empty());
        assertThat(call("POST", "/api/auth/google",
                Map.of("id_token", "forged", "email", victim, "google_id", "x"), null).status()).isEqualTo(401);

        // A real token for another Google account does not reach the victim's account either
        when(firebase.verify("attacker")).thenReturn(Optional.of(
                new FirebaseIdentity("uid-" + UUID.randomUUID(), uniqueEmail("attacker"), true)));
        assertThat(call("POST", "/api/auth/google",
                Map.of("id_token", "attacker", "email", victim, "google_id", uid), null).status()).isEqualTo(404);

        // Google accounts whose email is not verified cannot be linked by email
        when(firebase.verify("unverified")).thenReturn(Optional.of(new FirebaseIdentity(uid, victim, false)));
        assertThat(call("POST", "/api/auth/google", Map.of("id_token", "unverified"), null).status()).isEqualTo(401);

        // The victim's own token links the Google account, then logs in by uid
        when(firebase.verify("victim")).thenReturn(Optional.of(new FirebaseIdentity(uid, victim, true)));
        Response linked = call("POST", "/api/auth/google", Map.of("id_token", "victim"), null);
        assertThat(linked.status()).isEqualTo(200);
        assertThat(linked.json().get("user").get("email").asString()).isEqualTo(victim);
        assertThat(linked.json().get("user").get("google_id").asString()).isEqualTo(uid);
    }

    @Test
    void googleRegisterUsesTheTokenEmail() {
        String email = uniqueEmail("google");
        when(firebase.verify("new-user")).thenReturn(Optional.of(
                new FirebaseIdentity("uid-" + UUID.randomUUID(), email, true)));

        Response r = call("POST", "/api/auth/google/register", Map.of("id_token", "new-user",
                "email", uniqueEmail("spoofed"), "first_name", "Gina"), null);
        assertThat(r.status()).isEqualTo(200);
        assertThat(r.json().get("user").get("email").asString()).isEqualTo(email);
        assertThat(r.json().get("user").get("has_password").asBoolean()).isFalse();
    }

    @Test
    void registerReturnsAccessJwtAndRefreshCookie() throws Exception {
        String email = uniqueEmail("reg");
        Response r = call("POST", "/api/register", Map.of(
                "first_name", "Ana", "last_name", "Test", "email", email,
                "password", "secret12", "password_confirmation", "secret12"), null);

        assertThat(r.status()).isEqualTo(200);
        SignedJWT jwt = SignedJWT.parse(r.json().get("access_token").asString());
        assertThat(jwt.getHeader().getAlgorithm()).isEqualTo(JWSAlgorithm.HS256);
        assertThat(jwt.verify(new MACVerifier(jwtSecret))).isTrue();
        JWTClaimsSet claims = jwt.getJWTClaimsSet();
        assertThat(claims.getSubject()).isEqualTo(r.json().get("user").get("id").asString());
        assertThat(claims.getIssuer()).isEqualTo("scrumflow");
        assertThat(claims.getJWTID()).isNotBlank();
        assertThat(Duration.between(claims.getIssueTime().toInstant(), claims.getExpirationTime().toInstant()))
                .isEqualTo(Duration.ofMinutes(15));
        assertThat(r.json().get("role").asString()).isEqualTo("chef");
        assertThat(r.json().get("user").get("has_password").asBoolean()).isTrue();
        assertThat(r.json().get("user").has("password")).isFalse();
        assertThat(r.cookies()).anySatisfy(c -> assertThat(c)
                .startsWith("refresh_token=").contains("HttpOnly").contains("SameSite=Lax").contains("Path=/"));
    }

    @Test
    void registrationSeedsDemoProjectAndEmployees() {
        Session s = register(uniqueEmail("demo"));
        Response projects = call("GET", "/api/projects", null, s.token());
        assertThat(projects.json()).hasSize(1);
        assertThat(projects.json().get(0).get("name").asString()).isEqualTo("test");
        assertThat(projects.json().get(0).get("total_capex").asString()).isEqualTo("1336300.00");
        assertThat(call("GET", "/api/employees", null, s.token()).json().size()).isGreaterThanOrEqualTo(34);
    }

    @Test
    void validationErrorsUseLaravelShape() {
        Response r = call("POST", "/api/register", Map.of("email", "not-an-email"), null);
        assertThat(r.status()).isEqualTo(422);
        assertThat(r.json().get("message").asString()).isEqualTo("The first name field is required. (and 3 more errors)");
        assertThat(r.json().get("errors").get("email").get(0).asString()).isEqualTo("The email field must be a valid email address.");
    }

    @Test
    void loginRejectsBadCredentials() {
        String email = uniqueEmail("login");
        register(email);
        Response r = call("POST", "/api/login", Map.of("email", email, "password", "wrong"), null);
        assertThat(r.status()).isEqualTo(401);
        assertThat(r.json().get("message").asString()).isEqualTo("Identifiants invalides");
    }

    @Test
    void passwordHashedByLaravelStillWorks() {
        // Produced by PHP: password_hash("legacyPass1", PASSWORD_BCRYPT, ["cost" => 12]), as Laravel stored it.
        String email = uniqueEmail("legacy");
        jdbc.update("insert into users (first_name, last_name, email, password, role, created_at, updated_at) "
                        + "values ('Old', 'User', ?, ?, 'chef', now(), now())",
                email, "$2y$12$i4wrth0hWRYUOD8uMSfcbeblXdyY6/chvFKyxvw9vyhWgSMrQnwWG");

        assertThat(call("POST", "/api/login", Map.of("email", email, "password", "legacyPass1"), null).status()).isEqualTo(200);
        assertThat(call("POST", "/api/login", Map.of("email", email, "password", "wrong"), null).status()).isEqualTo(401);

        // new hashes keep the same $2y$ format, so they stay readable by PHP as well
        String fresh = uniqueEmail("fresh");
        register(fresh);
        assertThat(jdbc.queryForObject("select password from users where email = ?", String.class, fresh)).startsWith("$2y$12$");
    }

    @Test
    void protectedRoutesRequireToken() {
        Response r = call("GET", "/api/me", null, null);
        assertThat(r.status()).isEqualTo(401);
        assertThat(r.json().get("message").asString()).isEqualTo("Unauthenticated.");
        assertThat(call("GET", "/api/me", null, "1|not-a-real-token").status()).isEqualTo(401);
        assertThat(call("GET", "/api/me", null, "not.a.jwt").status()).isEqualTo(401);
    }

    @Test
    void refreshRotatesTokenAndLogoutRevokesBoth() {
        Session s = register(uniqueEmail("refresh"));

        Response refreshed = call("POST", "/api/refresh-token", null, null, s.refreshCookie());
        assertThat(refreshed.status()).isEqualTo(200);
        String newToken = refreshed.json().get("access_token").asString();
        String newCookie = refreshed.refreshCookie();
        assertThat(newCookie).isNotEqualTo(s.refreshCookie());

        // the old refresh token was consumed by the rotation
        assertThat(call("POST", "/api/refresh-token", null, null, s.refreshCookie()).status()).isEqualTo(401);
        assertThat(call("GET", "/api/me", null, newToken).status()).isEqualTo(200);

        Response logout = call("POST", "/api/logout", null, newToken, newCookie);
        assertThat(logout.status()).isEqualTo(200);
        assertThat(logout.cookies()).anySatisfy(c -> assertThat(c).startsWith("refresh_token=;").contains("Max-Age=0"));
        assertThat(call("GET", "/api/me", null, newToken).status()).isEqualTo(401);
        assertThat(call("POST", "/api/refresh-token", null, null, newCookie).status()).isEqualTo(401);
    }

    /** An access token like the backend's, signed with the given secret and algorithm. */
    private static String accessToken(String subject, Instant expiresAt, String secret, JWSAlgorithm alg) throws Exception {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("scrumflow")
                .subject(subject)
                .issueTime(Date.from(expiresAt.minus(Duration.ofMinutes(15))))
                .expirationTime(Date.from(expiresAt))
                .jwtID(UUID.randomUUID().toString())
                .build();
        SignedJWT jwt = new SignedJWT(new JWSHeader(alg), claims);
        jwt.sign(new MACSigner(secret.getBytes(StandardCharsets.UTF_8)));
        return jwt.serialize();
    }

    @Test
    void forgedOrExpiredAccessTokensAreRejected() throws Exception {
        Response r = call("POST", "/api/register", Map.of("first_name", "Ana", "last_name", "Test",
                "email", uniqueEmail("jwt"), "password", "secret12", "password_confirmation", "secret12"), null);
        String userId = r.json().get("user").get("id").asString();
        Instant later = Instant.now().plus(Duration.ofMinutes(10));

        // The test's own signing works, so the rejections below come from the checks
        assertThat(call("GET", "/api/me", null, accessToken(userId, later, jwtSecret, JWSAlgorithm.HS256)).status()).isEqualTo(200);

        String expired = accessToken(userId, Instant.now().minus(Duration.ofMinutes(5)), jwtSecret, JWSAlgorithm.HS256);
        assertThat(call("GET", "/api/me", null, expired).status()).isEqualTo(401);
        String otherKey = accessToken(userId, later, "another-secret-that-is-long-enough-0123", JWSAlgorithm.HS256);
        assertThat(call("GET", "/api/me", null, otherKey).status()).isEqualTo(401);
        String otherAlg = accessToken(userId, later, jwtSecret + jwtSecret, JWSAlgorithm.HS512);
        assertThat(call("GET", "/api/me", null, otherAlg).status()).isEqualTo(401);

        // Changing the user in a real token breaks its signature
        String[] parts = r.json().get("access_token").asString().split("\\.");
        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8)
                .replace("\"sub\":\"" + userId + "\"", "\"sub\":\"1\"");
        String tampered = parts[0] + "." + Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + "." + parts[2];
        assertThat(call("GET", "/api/me", null, tampered).status()).isEqualTo(401);

        // Unsigned tokens ("alg": "none") are refused
        String unsigned = new PlainJWT(SignedJWT.parse(r.json().get("access_token").asString()).getJWTClaimsSet()).serialize();
        assertThat(call("GET", "/api/me", null, unsigned).status()).isEqualTo(401);
    }

    /** Asks for a reset link and returns the token the e-mail would carry. */
    private String requestResetToken(String email) throws Exception {
        clearInvocations(mail);
        assertThat(call("POST", "/api/forgot-password", Map.of("email", email), null).status()).isEqualTo(200);
        ArgumentCaptor<String> token = ArgumentCaptor.forClass(String.class);
        verify(mail).sendPasswordReset(eq(email), token.capture());
        return token.getValue();
    }

    private Response resetPassword(String email, String token, String password) {
        return call("POST", "/api/reset-password", Map.of("email", email, "token", token,
                "password", password, "password_confirmation", password), null);
    }

    @Test
    void passwordResetFlow() throws Exception {
        String email = uniqueEmail("reset");
        Session before = register(email);
        String token = requestResetToken(email);

        // Only a hash of the token is stored
        String stored = jdbc.queryForObject("select token from password_reset_tokens where email = ?", String.class, email);
        assertThat(stored).isNotEqualTo(token).isEqualTo(TokenService.sha256(token));

        assertThat(resetPassword(email, "nope", "brandNew1").status()).isEqualTo(400);
        assertThat(resetPassword(email, token, "brandNew1").status()).isEqualTo(200);
        assertThat(call("POST", "/api/login", Map.of("email", email, "password", "brandNew1"), null).status()).isEqualTo(200);

        // The reset ended the sessions opened with the old password, and the token is single use
        assertThat(call("GET", "/api/me", null, before.token()).status()).isEqualTo(401);
        assertThat(call("POST", "/api/refresh-token", null, null, before.refreshCookie()).status()).isEqualTo(401);
        assertThat(resetPassword(email, token, "brandNew2").status()).isEqualTo(400);
    }

    @Test
    void resetTokenExpiresAfterAnHour() throws Exception {
        String email = uniqueEmail("reset-old");
        register(email);
        String token = requestResetToken(email);
        jdbc.update("update password_reset_tokens set created_at = created_at - interval '61 minutes' where email = ?", email);
        assertThat(resetPassword(email, token, "brandNew1").status()).isEqualTo(400);
    }

    @Test
    void forgotPasswordDoesNotRevealAccounts() throws Exception {
        String known = uniqueEmail("known");
        register(known);
        clearInvocations(mail);
        Response forKnown = call("POST", "/api/forgot-password", Map.of("email", known), null);
        Response forUnknown = call("POST", "/api/forgot-password", Map.of("email", uniqueEmail("nobody")), null);

        assertThat(forUnknown.status()).isEqualTo(forKnown.status()).isEqualTo(200);
        assertThat(forUnknown.json()).isEqualTo(forKnown.json());
        verify(mail, times(1)).sendPasswordReset(anyString(), anyString());
    }

    @Test
    void passwordsNeedEightCharactersWithALetterAndANumber() {
        for (String weak : new String[] {"short1", "onlyletters", "12345678"}) {
            Response r = call("POST", "/api/register", Map.of("first_name", "Ana", "last_name", "Test",
                    "email", uniqueEmail("weak"), "password", weak, "password_confirmation", weak), null);
            assertThat(r.status()).as(weak).isEqualTo(422);
            assertThat(r.json().get("errors").has("password")).as(weak).isTrue();
        }
    }

    @Test
    void changingPasswordEndsOtherSessionsButKeepsThisOne() {
        String email = uniqueEmail("change");
        Session other = register(email);
        Session self = login(email, "secret12");

        Response changed = call("POST", "/api/profile/password", Map.of("current_password", "secret12",
                "new_password", "changed12", "new_password_confirmation", "changed12"), self.token(), self.refreshCookie());
        assertThat(changed.status()).isEqualTo(200);

        // Both earlier sessions are over...
        assertThat(call("GET", "/api/me", null, other.token()).status()).isEqualTo(401);
        assertThat(call("POST", "/api/refresh-token", null, null, other.refreshCookie()).status()).isEqualTo(401);
        assertThat(call("GET", "/api/me", null, self.token()).status()).isEqualTo(401);
        // ...and the browser that changed it carries on with the new one
        assertThat(call("GET", "/api/me", null, changed.json().get("access_token").asString(), null).status()).isEqualTo(200);
        assertThat(call("POST", "/api/refresh-token", null, null, changed.refreshCookie()).status()).isEqualTo(200);
    }

    private Session login(String email, String password) {
        Response r = call("POST", "/api/login", Map.of("email", email, "password", password), null);
        return new Session(r.json().get("access_token").asString(), r.refreshCookie());
    }
}
