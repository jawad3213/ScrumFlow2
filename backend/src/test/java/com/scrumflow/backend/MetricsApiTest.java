package com.scrumflow.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalManagementPort;

/** Prometheus metrics are published on the management port only, never on the public API port. */
class MetricsApiTest extends ApiTestBase {

    private static final HttpClient HTTP = HttpClient.newHttpClient();

    @LocalManagementPort
    private int managementPort;

    @Test
    void prometheusEndpointIsOnTheManagementPort() throws Exception {
        call("GET", "/up", null, null); // at least one recorded HTTP request

        HttpResponse<String> metrics = get(managementPort, "/actuator/prometheus");
        assertThat(metrics.statusCode()).isEqualTo(200);
        assertThat(metrics.body())
                .contains("http_server_requests_seconds_bucket")
                .contains("application=\"scrumflow-backend\"")
                .contains("jvm_memory_used_bytes")
                .contains("hikaricp_connections_active");
    }

    @Test
    void actuatorIsNotServedOnTheApiPort() throws Exception {
        assertThat(managementPort).isNotEqualTo(port);
        assertThat(get(port, "/actuator/prometheus").statusCode()).isEqualTo(404);
    }

    private static HttpResponse<String> get(int port, String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build();
        return HTTP.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
