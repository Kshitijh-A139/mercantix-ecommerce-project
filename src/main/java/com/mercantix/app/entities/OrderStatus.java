package com.mercantix.app.entities;

import com.mercantix.app.exceptions.BusinessRuleException;

/**
 * The lifecycle states an order can be in. Stored on {@link Order#getStatus()}
 * as a String, but parsed/validated through this enum so the admin API can
 * never set an arbitrary value.
 */
public enum OrderStatus {
    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED;

    /** Parse a client-supplied status, throwing 400 on anything unrecognised. */
    public static OrderStatus parse(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new BusinessRuleException("status is required");
        }
        try {
            return OrderStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessRuleException(
                    "Invalid status '" + raw + "'. Allowed: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED");
        }
    }
}
