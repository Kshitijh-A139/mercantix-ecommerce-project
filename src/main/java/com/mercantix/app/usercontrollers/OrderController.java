package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.OrderResponse;
import com.mercantix.app.dto.PlaceOrderRequest;
import com.mercantix.app.entities.User;
import com.mercantix.app.userservices.OrderServiceContract;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Customer order endpoints (all require authentication).
 *
 *   GET  /api/orders        — the caller's orders, newest first
 *   GET  /api/orders/{id}   — a single order the caller owns
 *   POST /api/orders        — place an order (server prices it from the catalogue)
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderServiceContract orderService;

    public OrderController(OrderServiceContract orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Integer id,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrder(id, user));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request,
                                                    @AuthenticationPrincipal User user) {
        OrderResponse created = orderService.placeOrder(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
