package com.scrumflow.backend.support;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Request input, normalised the way Laravel's global middleware did it (TrimStrings and
 * ConvertEmptyStringsToNull, applied recursively), with the familiar has()/get()/only() helpers.
 * Controllers receive it as a method argument, see {@link com.scrumflow.backend.config.WebConfig}.
 */
public final class Input {

    private static final Set<String> UNTRIMMED = Set.of("current_password", "password", "password_confirmation");

    private final Map<String, Object> data;

    public Input(Map<?, ?> raw) {
        this.data = raw == null ? new LinkedHashMap<>() : normaliseMap(raw);
    }

    public Map<String, Object> all() {
        return Collections.unmodifiableMap(data);
    }

    /** Laravel has(): the key is present, even when its value is null. */
    public boolean has(String key) {
        return data.containsKey(key);
    }

    public Object get(String key) {
        return data.get(key);
    }

    public String str(String key) {
        return Values.str(data.get(key));
    }

    /** Laravel only(): the subset of the given keys that are present in the request. */
    public Map<String, Object> only(String... keys) {
        Map<String, Object> out = new LinkedHashMap<>();
        for (String key : keys) {
            if (data.containsKey(key)) {
                out.put(key, data.get(key));
            }
        }
        return out;
    }

    public void merge(String key, Object value) {
        data.put(key, value);
    }

    private static Map<String, Object> normaliseMap(Map<?, ?> raw) {
        Map<String, Object> out = new LinkedHashMap<>();
        raw.forEach((k, v) -> out.put(String.valueOf(k), normalise(String.valueOf(k), v)));
        return out;
    }

    private static Object normalise(String key, Object value) {
        if (value instanceof String s) {
            String v = UNTRIMMED.contains(key) ? s : s.strip();
            return v.isEmpty() ? null : v;
        }
        if (value instanceof Map<?, ?> m) {
            return normaliseMap(m);
        }
        if (value instanceof List<?> list) {
            List<Object> out = new ArrayList<>(list.size());
            for (int i = 0; i < list.size(); i++) {
                out.add(normalise(String.valueOf(i), list.get(i)));
            }
            return out;
        }
        return value;
    }
}
