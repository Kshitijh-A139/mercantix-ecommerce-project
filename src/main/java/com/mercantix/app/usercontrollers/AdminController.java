package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.AdminOrderResponse;
import com.mercantix.app.entities.Order;
import com.mercantix.app.entities.OrderStatus;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.userrepositories.OrderRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only order management.
 * URL-level ADMIN guard is in SecurityConfig (/api/admin/** → hasRole("ADMIN")).
 * @PreAuthorize provides method-level double-guard for clarity.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final OrderRepository orderRepository;

    public AdminController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ── GET /api/admin/orders ─────────────────────────────────────────────

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {

        Sort sort = Sort.by("createdAt").descending();

        List<Order> orders;
        if (status != null && !status.isBlank()) {
            // Validate the filter value against the known states (400 if bogus).
            OrderStatus parsed = OrderStatus.parse(status);
            orders = orderRepository.findByStatus(parsed.name(), sort);
        } else {
            orders = orderRepository.findAll(sort);
        }

        return ResponseEntity.ok(orders.stream().map(AdminOrderResponse::from).toList());
    }

    // ── PUT /api/admin/orders/{id}/status ─────────────────────────────────

    @PutMapping("/orders/{id}/status")
    @Transactional
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(@PathVariable Integer id,
                                                                @RequestBody Map<String, String> body) {
        OrderStatus newStatus = OrderStatus.parse(body.get("status"));   // throws 400 if invalid/blank

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        order.setStatus(newStatus.name());
        Order saved = orderRepository.save(order);

        return ResponseEntity.ok(AdminOrderResponse.from(saved));
    }
}
