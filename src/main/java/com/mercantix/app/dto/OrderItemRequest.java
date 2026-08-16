package com.mercantix.app.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * A single requested line item. NOTE: the client does NOT supply price — the
 * server always prices items from the current product record to prevent
 * price tampering.
 */
public class OrderItemRequest {

    @NotNull(message = "productId is required")
    private Integer productId;

    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be at least 1")
    @Max(value = 999, message = "quantity must not exceed 999")
    private Integer quantity;

    public Integer getProductId()            { return productId; }
    public void    setProductId(Integer p)   { this.productId = p; }

    public Integer getQuantity()             { return quantity; }
    public void    setQuantity(Integer q)    { this.quantity = q; }
}
