package com.mercantix.app.dto;

import com.mercantix.app.entities.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Admin view of an order — like {@link OrderResponse} but also exposes the
 * customer identity (admins legitimately need to see who placed it).
 */
public class AdminOrderResponse {

    private final Integer                 orderId;
    private final Integer                 customerId;
    private final String                  customerUsername;
    private final String                  customerEmail;
    private final BigDecimal              total;
    private final String                  status;
    private final String                  paymentMethod;
    private final String                  shippingAddress;
    private final List<OrderItemResponse> items;
    private final LocalDateTime           createdAt;

    private AdminOrderResponse(Order o) {
        this.orderId          = o.getOrderId();
        this.customerId       = o.getUser() != null ? o.getUser().getUserId() : null;
        this.customerUsername = o.getUser() != null ? o.getUser().getUsername() : null;
        this.customerEmail    = o.getUser() != null ? o.getUser().getEmail() : null;
        this.total            = o.getTotal();
        this.status           = o.getStatus();
        this.paymentMethod    = o.getPaymentMethod();
        this.shippingAddress  = o.getShippingAddress();
        this.items            = o.getItems().stream().map(OrderItemResponse::from).toList();
        this.createdAt        = o.getCreatedAt();
    }

    public static AdminOrderResponse from(Order o) { return new AdminOrderResponse(o); }

    public Integer                 getOrderId()          { return orderId; }
    public Integer                 getCustomerId()       { return customerId; }
    public String                  getCustomerUsername() { return customerUsername; }
    public String                  getCustomerEmail()    { return customerEmail; }
    public BigDecimal              getTotal()            { return total; }
    public String                  getStatus()           { return status; }
    public String                  getPaymentMethod()    { return paymentMethod; }
    public String                  getShippingAddress()  { return shippingAddress; }
    public List<OrderItemResponse> getItems()            { return items; }
    public LocalDateTime           getCreatedAt()        { return createdAt; }
}
