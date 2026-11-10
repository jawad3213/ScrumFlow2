package com.scrumflow.backend.support;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Loose, PHP-like conversions for values that come out of decoded JSON request bodies. */
public final class Values {

    private Values() {
    }

    public static String str(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Boolean b) {
            return b ? "1" : "";
        }
        if (value instanceof Double d && !d.isInfinite() && !d.isNaN()) {
            return BigDecimal.valueOf(d).stripTrailingZeros().toPlainString();
        }
        return String.valueOf(value);
    }

    /** PHP implode("\n", $array) when the value is an array, otherwise the value as a string. */
    public static String joinLines(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(Values::str).collect(Collectors.joining("\n"));
        }
        if (value instanceof Map<?, ?> map) {
            return map.values().stream().map(Values::str).collect(Collectors.joining("\n"));
        }
        return str(value);
    }

    /** PHP's "??" operator: the first non-null value. */
    public static Object coalesce(Object... values) {
        for (Object v : values) {
            if (v != null) {
                return v;
            }
        }
        return null;
    }

    /** Value for a decimal(p, scale) column. Non-numeric input throws, as the database insert would fail. */
    public static BigDecimal dec(Object value, int scale) {
        if (value == null) {
            return null;
        }
        BigDecimal number = value instanceof Boolean b
                ? BigDecimal.valueOf(b ? 1 : 0)
                : new BigDecimal(str(value).trim());
        return number.setScale(scale, RoundingMode.HALF_UP);
    }

    /** Value for an integer column; PostgreSQL rounds numeric input when casting to integer. */
    public static Integer integer(Object value) {
        BigDecimal number = dec(value, 0);
        return number == null ? null : number.intValueExact();
    }

    /** PHP is_numeric(). */
    public static boolean isNumeric(Object value) {
        if (value instanceof Number) {
            return true;
        }
        if (value instanceof String s && !s.isBlank()) {
            try {
                new BigDecimal(s.trim());
                return true;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }

    /** Values accepted by Laravel's "boolean" rule, or null when the value is not one of them. */
    public static Boolean bool(Object value) {
        if (value instanceof Boolean b) {
            return b;
        }
        if (value instanceof Number n && (n.doubleValue() == 0 || n.doubleValue() == 1)) {
            return n.doubleValue() == 1;
        }
        String s = value instanceof String ? (String) value : null;
        if ("1".equals(s)) {
            return true;
        }
        if ("0".equals(s)) {
            return false;
        }
        return null;
    }

    /** PHP truthiness for strings: null, "" and "0" are false. */
    public static boolean truthy(String value) {
        return value != null && !value.isEmpty() && !"0".equals(value);
    }

    /** Parses what the frontend and AI service send for dates: ISO date, date-time, or offset date-time. */
    public static LocalDate date(Object value) {
        String s = str(value);
        if (s == null) {
            return null;
        }
        s = s.trim();
        try {
            return OffsetDateTime.parse(s).toLocalDate();
        } catch (DateTimeParseException ignored) {
            // try the next format
        }
        try {
            return LocalDateTime.parse(s.replace(' ', 'T')).toLocalDate();
        } catch (DateTimeParseException ignored) {
            // try the next format
        }
        try {
            return LocalDate.parse(s);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
