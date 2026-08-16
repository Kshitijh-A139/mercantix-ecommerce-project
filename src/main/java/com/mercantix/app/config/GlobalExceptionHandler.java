package com.mercantix.app.config;

import com.mercantix.app.exceptions.BusinessRuleException;
import com.mercantix.app.exceptions.DuplicateResourceException;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralised REST error handling.
 *
 * Every handler returns the same shape:
 *   {
 *     "timestamp": "2026-05-28T11:23:45",
 *     "status":    400,
 *     "error":     "Bad Request",
 *     "message":   "...",
 *     "path":      "/api/...",
 *     "fields":    { ...optional, only for validation errors }
 *   }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ── 400 Bean Validation (@Valid) ──────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {

        Map<String, String> fields = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fields.put(fe.getField(), fe.getDefaultMessage());
        }
        Map<String, Object> body = baseBody(HttpStatus.BAD_REQUEST, "Validation failed", req);
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    // ── 400 Path/Query parameter type mismatch ─────────────────────────────

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest req) {

        String msg = "Invalid value for parameter '" + ex.getName() + "'";
        return build(HttpStatus.BAD_REQUEST, msg, req);
    }

    // ── 400 Custom business rules ──────────────────────────────────────────

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusiness(
            BusinessRuleException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    // ── 401 Bad credentials ────────────────────────────────────────────────

    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            Exception ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, "Invalid username or password", req);
    }

    // ── 403 Access denied ──────────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest req) {
        return build(HttpStatus.FORBIDDEN, "Forbidden: insufficient privileges", req);
    }

    // ── 404 Not found ──────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    // ── 405 Wrong HTTP method ──────────────────────────────────────────────

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        return build(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage(), req);
    }

    // ── 409 Conflict (duplicate resources) ─────────────────────────────────

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(
            DuplicateResourceException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), req);
    }

    // ── Spring's ResponseStatusException (any HTTP code) ───────────────────

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(
            ResponseStatusException ex, HttpServletRequest req) {
        HttpStatusCode status = ex.getStatusCode();
        String message = ex.getReason() != null ? ex.getReason() : ex.getMessage();
        return build(HttpStatus.valueOf(status.value()), message, req);
    }

    // ── 500 Catch-all ──────────────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(
            Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception on {} {}", req.getMethod(), req.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", req);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, HttpServletRequest req) {
        return ResponseEntity.status(status).body(baseBody(status, message, req));
    }

    private Map<String, Object> baseBody(HttpStatus status, String message, HttpServletRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status",    status.value());
        body.put("error",     status.getReasonPhrase());
        body.put("message",   message);
        body.put("path",      req.getRequestURI());
        return body;
    }
}
