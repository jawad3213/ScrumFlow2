package com.scrumflow.backend.web;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scrumflow.backend.support.Json;

/** Liveness check at /up (the path Laravel used), also used by the deploy script. */
@RestController
public class HealthController {

    private final JdbcTemplate jdbc;

    public HealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/up")
    public Map<String, Object> up() {
        jdbc.queryForObject("select 1", Integer.class);
        return Json.obj("status", "up");
    }
}
