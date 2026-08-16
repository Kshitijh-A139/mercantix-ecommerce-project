package com.mercantix.app.userrepositories;

import com.mercantix.app.entities.Order;
import com.mercantix.app.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Items are fetched eagerly via entity graph so responses can be serialised
    // with open-in-view disabled, and to avoid an N+1 over order lines.

    // User's own orders, newest first
    @EntityGraph(attributePaths = "items")
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = "items")
    Optional<Order> findWithItemsByOrderId(Integer orderId);

    // Admin: all orders with sorting
    @EntityGraph(attributePaths = "items")
    List<Order> findAll(Sort sort);

    // Admin: filter by status
    @EntityGraph(attributePaths = "items")
    List<Order> findByStatus(String status, Sort sort);
}
