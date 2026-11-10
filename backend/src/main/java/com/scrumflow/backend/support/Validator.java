package com.scrumflow.backend.support;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * A small port of the subset of Laravel's validator the API uses, with the same rule strings,
 * evaluation order and English messages, so error payloads stay identical for the frontend.
 *
 * <p>Supported rules: sometimes, required, nullable, string, email, numeric, boolean, array, date,
 * max:n, min:n, confirmed, after_or_equal:field, exists:table,column and unique:table,column.
 * A field name ending in ".*" applies its rules to every element of an array.</p>
 */
public final class Validator {

    private static final Pattern IDENTIFIER = Pattern.compile("[a-z_][a-z0-9_]*");
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+$");

    private final Map<String, Object> data;
    private final JdbcTemplate jdbc;
    private final Map<String, List<String>> errors = new LinkedHashMap<>();

    Validator(Map<String, Object> data, JdbcTemplate jdbc) {
        this.data = data;
        this.jdbc = jdbc;
    }

    public Validator rule(String field, String rules) {
        List<String> ruleList = Arrays.asList(rules.split("\\|"));
        if (field.endsWith(".*")) {
            String parent = field.substring(0, field.length() - 2);
            if (data.get(parent) instanceof List<?> list) {
                for (int i = 0; i < list.size(); i++) {
                    check(parent + "." + i, true, list.get(i), ruleList);
                }
            }
        } else {
            check(field, data.containsKey(field), data.get(field), ruleList);
        }
        return this;
    }

    public boolean fails() {
        return !errors.isEmpty();
    }

    public Map<String, List<String>> errors() {
        return errors;
    }

    public List<String> allMessages() {
        return errors.values().stream().flatMap(Collection::stream).toList();
    }

    /** Laravel's $request->validate(): a 422 with a summary message and the per-field errors. */
    public void validate() {
        if (!fails()) {
            return;
        }
        List<String> all = allMessages();
        String message = all.get(0);
        int more = all.size() - 1;
        if (more > 0) {
            message += " (and " + more + " more error" + (more > 1 ? "s" : "") + ")";
        }
        throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, Json.obj("message", message, "errors", errors));
    }

    /** 422 with only the errors object, as returned by the controllers that used Validator::make(). */
    public void validateErrorsOnly() {
        if (fails()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, Json.obj("errors", errors));
        }
    }

    private void check(String field, boolean present, Object value, List<String> rules) {
        if (rules.contains("sometimes") && !present) {
            return;
        }
        boolean nullable = rules.contains("nullable");
        boolean numericContext = rules.contains("numeric");
        for (String rule : rules) {
            String name = rule.contains(":") ? rule.substring(0, rule.indexOf(':')) : rule;
            String param = rule.contains(":") ? rule.substring(rule.indexOf(':') + 1) : null;
            if (name.equals("sometimes") || name.equals("nullable")) {
                continue;
            }
            if (name.equals("required")) {
                if (isEmpty(value)) {
                    fail(field, "The %s field is required.");
                    return; // a failed implicit rule stops validation of this field
                }
                continue;
            }
            if (!present || (nullable && value == null)) {
                continue;
            }
            String error = evaluate(field, name, param, value, numericContext);
            if (error != null) {
                fail(field, error);
            }
        }
    }

    private String evaluate(String field, String rule, String param, Object value, boolean numericContext) {
        switch (rule) {
            case "string":
                return value instanceof String ? null : "The %s field must be a string.";
            case "email":
                return value instanceof String s && EMAIL.matcher(s).matches()
                        ? null : "The %s field must be a valid email address.";
            case "numeric":
                return Values.isNumeric(value) ? null : "The %s field must be a number.";
            case "boolean":
                return Values.bool(value) != null ? null : "The %s field must be true or false.";
            case "array":
                return value instanceof List || value instanceof Map ? null : "The %s field must be an array.";
            case "date":
                return value instanceof String && Values.date(value) != null ? null : "The %s field must be a valid date.";
            case "max":
                return size(value, numericContext) <= Double.parseDouble(param) ? null : maxMessage(value, numericContext, param);
            case "min":
                return size(value, numericContext) >= Double.parseDouble(param) ? null : minMessage(value, numericContext, param);
            case "letters": // Laravel's Password::letters()
                return value instanceof String s && s.codePoints().anyMatch(Character::isLetter)
                        ? null : "The %s field must contain at least one letter.";
            case "numbers": // Laravel's Password::numbers()
                return value instanceof String s && s.codePoints().anyMatch(Character::isDigit)
                        ? null : "The %s field must contain at least one number.";
            case "confirmed":
                return Objects.equals(value, data.get(field + "_confirmation"))
                        ? null : "The %s field confirmation does not match.";
            case "after_or_equal": {
                LocalDate self = Values.date(value);
                LocalDate other = Values.date(data.get(param));
                boolean ok = self != null && other != null && !self.isBefore(other);
                return ok ? null : "The %s field must be a date after or equal to " + attribute(param) + ".";
            }
            case "exists":
                return countMatching(param, value) > 0 ? null : "The selected %s is invalid.";
            case "unique":
                return countMatching(param, value) == 0 ? null : "The %s has already been taken.";
            default:
                throw new IllegalArgumentException("Unsupported validation rule: " + rule);
        }
    }

    private long countMatching(String param, Object value) {
        String[] parts = param.split(",");
        String table = parts[0];
        String column = parts.length > 1 ? parts[1] : "id";
        if (!IDENTIFIER.matcher(table).matches() || !IDENTIFIER.matcher(column).matches()) {
            throw new IllegalArgumentException("Invalid table or column in rule: " + param);
        }
        if (value instanceof Map || value instanceof List) {
            return 0;
        }
        Long count = jdbc.queryForObject(
                "select count(*) from " + table + " where cast(" + column + " as text) = ?",
                Long.class, Values.str(value));
        return count == null ? 0 : count;
    }

    private static double size(Object value, boolean numericContext) {
        if (numericContext && Values.isNumeric(value)) {
            return new BigDecimal(Values.str(value)).doubleValue();
        }
        if (value instanceof Collection<?> c) {
            return c.size();
        }
        if (value instanceof Map<?, ?> m) {
            return m.size();
        }
        String s = Values.str(value);
        return s == null ? 0 : s.codePointCount(0, s.length());
    }

    private static String maxMessage(Object value, boolean numericContext, String max) {
        if (numericContext) {
            return "The %s field must not be greater than " + max + ".";
        }
        if (value instanceof Collection || value instanceof Map) {
            return "The %s field must not have more than " + max + " items.";
        }
        return "The %s field must not be greater than " + max + " characters.";
    }

    private static String minMessage(Object value, boolean numericContext, String min) {
        if (numericContext) {
            return "The %s field must be at least " + min + ".";
        }
        if (value instanceof Collection || value instanceof Map) {
            return "The %s field must have at least " + min + " items.";
        }
        return "The %s field must be at least " + min + " characters.";
    }

    private static boolean isEmpty(Object value) {
        return value == null
                || (value instanceof String s && s.isBlank())
                || (value instanceof Collection<?> c && c.isEmpty())
                || (value instanceof Map<?, ?> m && m.isEmpty());
    }

    private void fail(String field, String template) {
        errors.computeIfAbsent(field, k -> new ArrayList<>()).add(template.formatted(attribute(field)));
    }

    /** Laravel's default attribute name: underscores become spaces ("first_name" becomes "first name"). */
    public static String attribute(String field) {
        return field.replace('_', ' ');
    }

    /** Adds an error produced outside the rule engine (for example, file checks). */
    public Validator addError(String field, String message) {
        errors.computeIfAbsent(field, k -> new ArrayList<>()).add(message);
        return this;
    }
}
