package com.mercantix.app.dto;

import com.mercantix.app.entities.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {

    private final Integer    productId;
    private final String     productName;
    private final Integer    quantity;
    private final BigDecimal price;

    private OrderItemResponse(OrderItem i) {
        this.productId   = i.getProductId();
        this.productName = i.getProductName();
        this.quantity    = i.getQuantity();
        this.price       = i.getPrice();
    }

    public static OrderItemResponse from(OrderItem i) { return new OrderItemResponse(i); }

    public Integer    getProductId()   { return productId; }
    public String     getProductName() { return productName; }
    public Integer    getQuantity()    { return quantity; }
    public BigDecimal getPrice()       { return price; }
}
