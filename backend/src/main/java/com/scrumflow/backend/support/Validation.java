package com.scrumflow.backend.support;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Creates {@link Validator}s; the database is needed for the exists and unique rules. */
@Component
public class Validation {

    /** Rules for a password being set; the frontend checks the same (utils/validation.js). */
    public static final String NEW_PASSWORD = "required|string|min:8|letters|numbers|confirmed";

    private final JdbcTemplate jdbc;

    public Validation(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Validator make(Input input) {
        return new Validator(input.all(), jdbc);
    }

    public Validator make(Map<String, Object> data) {
        return new Validator(data, jdbc);
    }
}
