package com.mercantix.app.exceptions;

/**
 * Thrown when a requested resource (product, user, order...) is not found.
 * Mapped to HTTP 404 by GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with id: " + id);
    }
}
