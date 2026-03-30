package com.mercantix.app.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleResponseStatusException(ResponseStatusException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("error", ex.getReason());
        error.put("status", ex.getStatusCode().value());

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(error);
    }
}