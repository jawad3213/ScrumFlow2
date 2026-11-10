package com.scrumflow.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application settings. Values come from the same environment variables the Laravel backend used
 * (MAIL_*, CORS_ALLOWED_ORIGINS, DB_*, ...), so existing .env files keep working.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String frontendUrl,
        String corsAllowedOrigins,
        String storagePath,
        boolean cookieSecure,
        String jwtSecret,
        String firebaseProjectId,
        Mail mail,
        Seed seed) {

    public record Mail(String mailer, String host, Integer port, String username, String password,
                       String scheme, String fromAddress, String fromName) {
    }

    public record Seed(boolean enabled, boolean exitAfter, String adminEmail, String adminPassword) {
    }

    /** The comma-separated CORS_ALLOWED_ORIGINS; there are no built-in origins. */
    public List<String> allowedOrigins() {
        if (corsAllowedOrigins == null) {
            return List.of();
        }
        return Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    /** Laravel's env() turned the literal "null" into null, and .env files rely on it (MAIL_USERNAME=null). */
    public static String clean(String value) {
        if (value == null) {
            return null;
        }
        String v = value.trim();
        return v.isEmpty() || v.equalsIgnoreCase("null") || v.equalsIgnoreCase("(null)") ? null : v;
    }
}
