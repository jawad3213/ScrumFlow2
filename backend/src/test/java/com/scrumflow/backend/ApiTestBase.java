package com.scrumflow.backend;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;

import com.scrumflow.backend.service.DemoDataService;
import com.scrumflow.backend.service.SpecializationService;
import com.scrumflow.backend.support.Values;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Starts the full application on a random port against a real PostgreSQL database and calls it
 * over HTTP, so requests go through Spring Security, Flyway-managed schema and JSON rendering.
 *
 * <p>All settings, the database included, come from src/test/resources/test.env. Tests use unique
 * e-mail addresses, so the database can be reused between runs.</p>
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:test.env")
public abstract class ApiTestBase {

    protected static final JsonMapper JSON = JsonMapper.builder().build();
    private static final HttpClient HTTP = HttpClient.newHttpClient();

    @LocalServerPort
    protected int port;

    /** JWT_SECRET of the test application, so tests can sign their own access tokens. */
    @Value("${JWT_SECRET}")
    protected String jwtSecret;

    @Autowired
    private SpecializationService specializations;

    @Autowired
    private DemoDataService demoData;

    /** The specialization catalogue must exist, as after "db:seed" in production. */
    @BeforeEach
    void seedCatalogue() throws IOException {
        for (Map<String, Object> s : demoData.specializationCatalogue()) {
            specializations.updateOrCreate(Values.str(s.get("name")), Values.str(s.get("level")), Values.dec(s.get("salary"), 2));
        }
    }

    protected static String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    protected Response call(String method, String path, Object body, String token, String cookie) {
        try {
            HttpRequest.Builder b = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                    .header("Accept", "application/json");
            if (token != null) {
                b.header("Authorization", "Bearer " + token);
            }
            if (cookie != null) {
                b.header("Cookie", cookie);
            }
            if (body != null) {
                b.header("Content-Type", "application/json")
                        .method(method, HttpRequest.BodyPublishers.ofString(JSON.writeValueAsString(body)));
            } else {
                b.method(method, HttpRequest.BodyPublishers.noBody());
            }
            HttpResponse<String> r = HTTP.send(b.build(), HttpResponse.BodyHandlers.ofString());
            JsonNode json = r.body().isEmpty() ? null : JSON.readTree(r.body());
            return new Response(r.statusCode(), json, r.headers().allValues("set-cookie"));
        } catch (IOException e) {
            throw new IllegalStateException(e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }

    protected Response call(String method, String path, Object body, String token) {
        return call(method, path, body, token, null);
    }

    /** Registers a new chef account and returns its access token and refresh cookie. */
    protected Session register(String email) {
        Response r = call("POST", "/api/register", Map.of(
                "first_name", "Test", "last_name", "User", "email", email,
                "password", "secret12", "password_confirmation", "secret12"), null);
        if (r.status() != 200) {
            throw new IllegalStateException("register failed: " + r);
        }
        return new Session(r.json().get("access_token").asString(), r.refreshCookie());
    }

    public record Session(String token, String refreshCookie) {
    }

    public record Response(int status, JsonNode json, List<String> cookies) {

        /** "refresh_token=..." from Set-Cookie, ready to send back in a Cookie header. */
        public String refreshCookie() {
            return cookies.stream().filter(c -> c.startsWith("refresh_token=")).map(c -> c.split(";", 2)[0])
                    .findFirst().orElse(null);
        }
    }
}
