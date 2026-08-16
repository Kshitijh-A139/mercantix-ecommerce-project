package com.mercantix.app.exceptions;

/**
 * Thrown when a business invariant is violated (e.g. out of stock, invalid order state).
 * Mapped to HTTP 400 by GlobalExceptionHandler.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
