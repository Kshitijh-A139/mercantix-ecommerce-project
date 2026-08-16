package com.mercantix.app.dto;

import com.mercantix.app.entities.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Stable response shape for orders. Decouples the API from the JPA entity and
 * (crucially) is materialised inside the service transaction, so it never trips
 * a LazyInitializationException when serialised with open-in-view disabled.
 */
public class OrderResponse {

    private final Integer                 orderId;
    private final BigDecimal              total;
    private final String                  status;
    private final String                  paymentMethod;
    private final String                  shippingAddress;
    private final List<OrderItemResponse> items;
    private final LocalDateTime           createdAt;

    private OrderResponse(Order o) {
        this.orderId         = o.getOrderId();
        this.total           = o.getTotal();
        this.status          = o.getStatus();
        this.paymentMethod   = o.getPaymentMethod();
        this.shippingAddress = o.getShippingAddress();
        this.items           = o.getItems().stream().map(OrderItemResponse::from).toList();
        this.createdAt       = o.getCreatedAt();
    }

    public static OrderResponse from(Order o) { return new OrderResponse(o); }

    public Integer                 getOrderId()         { return orderId; }
    public BigDecimal              getTotal()           { return total; }
    public String                  getStatus()          { return status; }
    public String                  getPaymentMethod()   { return paymentMethod; }
    public String                  getShippingAddress() { return shippingAddress; }
    public List<OrderItemResponse> getItems()           { return items; }
    public LocalDateTime           getCreatedAt()       { return createdAt; }
}
