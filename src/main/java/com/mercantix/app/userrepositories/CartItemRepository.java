package com.mercantix.app.userrepositories;

import com.mercantix.app.entities.CartItem;
import com.mercantix.app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUserOrderByAddedAtDesc(User user);

    Optional<CartItem> findByUserAndProductProductId(User user, Integer productId);

    void deleteByUser(User user);
}
