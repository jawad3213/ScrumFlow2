package com.scrumflow.backend.web;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Json;

import jakarta.servlet.http.HttpServletRequest;

/** Error responses in the JSON shapes Laravel produced for API requests (APP_DEBUG=false). */
@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    ResponseEntity<Map<String, Object>> api(ApiException e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    ResponseEntity<Map<String, Object>> noRoute(HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Json.obj("message", "The route " + path(request) + " could not be found."));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    ResponseEntity<Map<String, Object>> methodNotAllowed(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        Set<HttpMethod> supported = e.getSupportedHttpMethods();
        String methods = supported == null ? "" : supported.stream().map(HttpMethod::name).sorted().collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(Json.obj("message",
                "The " + request.getMethod() + " method is not supported for route " + path(request)
                        + ". Supported methods: " + methods + "."));
    }

    /** A non-numeric {id} never matches a row. */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<Map<String, Object>> badId() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Json.obj("message", "Not Found"));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<Map<String, Object>> tooLarge() {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(Json.obj("message", "The uploaded file is too large."));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, Object>> unexpected(Exception e, HttpServletRequest request) {
        log.error("Unhandled error on {} {}", request.getMethod(), request.getRequestURI(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Json.obj("message", "Server Error"));
    }

    private static String path(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/") ? uri.substring(1) : uri;
    }
}
