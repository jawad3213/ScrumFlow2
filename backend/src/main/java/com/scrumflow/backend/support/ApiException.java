package com.scrumflow.backend.support;

import java.util.Map;

import org.springframework.http.HttpStatus;

/** An error that maps directly to a JSON response, like Laravel's response()->json([...], status). */
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final transient Map<String, Object> body;

    public ApiException(HttpStatus status, Map<String, Object> body) {
        super(String.valueOf(body.get("message")));
        this.status = status;
        this.body = body;
    }

    public static ApiException of(HttpStatus status, String message) {
        return new ApiException(status, Json.obj("message", message));
    }

    /** Same message as Eloquent's ModelNotFoundException (findOrFail / firstOrFail). */
    public static ApiException notFound(String model, Object id) {
        String suffix = id == null ? "." : " " + id;
        return of(HttpStatus.NOT_FOUND, "No query results for model [App\\Models\\" + model + "]" + suffix);
    }

    public HttpStatus status() {
        return status;
    }

    public Map<String, Object> body() {
        return body;
    }
}
