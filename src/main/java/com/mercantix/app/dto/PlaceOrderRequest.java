package com.mercantix.app.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request body for POST /api/orders.
 * The server prices the order and computes the total itself — any client-supplied
 * price/total is intentionally ignored.
 */
public class PlaceOrderRequest {

    @NotEmpty(message = "Order must include at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @Size(max = 50, message = "paymentMethod must not exceed 50 characters")
    private String paymentMethod;

    @Valid
    private ShippingAddressRequest shippingAddress;

    public List<OrderItemRequest> getItems()              { return items; }
    public void setItems(List<OrderItemRequest> items)    { this.items = items; }

    public String getPaymentMethod()                      { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod)    { this.paymentMethod = paymentMethod; }

    public ShippingAddressRequest getShippingAddress()    { return shippingAddress; }
    public void setShippingAddress(ShippingAddressRequest s) { this.shippingAddress = s; }
}
