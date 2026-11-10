package com.scrumflow.backend.support;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Formatting helpers that reproduce how Laravel serialised Eloquent models, so the React frontend
 * receives exactly the shapes it was built against:
 * <ul>
 *   <li>timestamps as {@code 2025-12-13T09:59:58.000000Z}</li>
 *   <li>date columns as {@code 2025-12-13}</li>
 *   <li>decimal columns as strings with their column scale, e.g. {@code "25000.00"}</li>
 * </ul>
 */
public final class Json {

    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'");

    private Json() {
    }

    /** Ordered map literal: obj("a", 1, "b", 2). Null values are kept. */
    public static Map<String, Object> obj(Object... keyValues) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            map.put((String) keyValues[i], keyValues[i + 1]);
        }
        return map;
    }

    public static String ts(LocalDateTime value) {
        return value == null ? null : value.format(TIMESTAMP);
    }

    public static String date(LocalDate value) {
        return value == null ? null : value.toString();
    }

    public static String dec(BigDecimal value) {
        return value == null ? null : value.toPlainString();
    }
}
