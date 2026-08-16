package com.mercantix.app.exceptions;

/**
 * Thrown when attempting to create a resource that violates a uniqueness constraint
 * (e.g. duplicate username/email). Mapped to HTTP 409 by GlobalExceptionHandler.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
