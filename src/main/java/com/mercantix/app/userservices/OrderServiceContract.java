package com.mercantix.app.userservices;

import com.mercantix.app.dto.OrderResponse;
import com.mercantix.app.dto.PlaceOrderRequest;
import com.mercantix.app.entities.User;

import java.util.List;

/**
 * Contract for the order domain. Controllers depend on this interface only.
 */
public interface OrderServiceContract {

    /** Place an order for the given user — prices and totals are computed server-side. */
    OrderResponse placeOrder(User user, PlaceOrderRequest request);

    /** The user's own orders, newest first. */
    List<OrderResponse> getMyOrders(User user);

    /** A single order owned by the user (404 if missing or not theirs). */
    OrderResponse getOrder(Integer orderId, User user);
}
