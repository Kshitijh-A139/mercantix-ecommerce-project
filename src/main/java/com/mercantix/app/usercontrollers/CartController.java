package com.mercantix.app.usercontrollers;

import com.mercantix.app.entities.CartItem;
import com.mercantix.app.entities.Product;
import com.mercantix.app.entities.User;
import com.mercantix.app.userrepositories.CartItemRepository;
import com.mercantix.app.userrepositories.ProductRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Server-side cart (persisted per user).
 * All endpoints require an authenticated CUSTOMER or ADMIN.
 *
 * Endpoints are productId-keyed so the frontend never has to track a separate
 * cartItem ID.  Repeated POSTs increment quantity (idempotent-ish).
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository  productRepository;

    public CartController(CartItemRepository cartItemRepository,
                          ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository  = productRepository;
    }

    // ── GET /api/cart  ────────────────────────────────────────────────────
    // Wraps the raw rows so the frontend gets {items, count, subtotal}.

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(@AuthenticationPrincipal User user) {
        List<CartItem> rows = cartItemRepository.findByUserOrderByAddedAtDesc(user);
        java.math.BigDecimal subtotal = rows.stream()
                .map(r -> r.getUnitPrice().multiply(new java.math.BigDecimal(r.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        int count = rows.stream().mapToInt(CartItem::getQuantity).sum();
        return ResponseEntity.ok(Map.of("items", rows, "count", count, "subtotal", subtotal));
    }

    // ── POST /api/cart/items  ─────────────────────────────────────────────
    // body: {productId, quantity?}.  Existing row = increment, new row = create.

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body,
                                       @AuthenticationPrincipal User user) {
        Integer productId = parseInt(body.get("productId"));
        Integer quantity  = body.containsKey("quantity") ? parseInt(body.get("quantity")) : 1;
        if (productId == null || quantity == null || quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "productId and positive quantity required"));
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
        }

        CartItem item = cartItemRepository
                .findByUserAndProductProductId(user, productId)
                .orElseGet(() -> {
                    CartItem fresh = new CartItem();
                    fresh.setUser(user);
                    fresh.setProduct(product);
                    fresh.setUnitPrice(product.getPrice());
                    fresh.setQuantity(0);
                    return fresh;
                });
        item.setQuantity(item.getQuantity() + quantity);

        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemRepository.save(item));
    }

    // ── PUT /api/cart/items/{productId}  ──────────────────────────────────
    // body: {quantity}.  Quantity ≤ 0 removes the row.

    @PutMapping("/items/{productId}")
    @Transactional
    public ResponseEntity<?> updateQuantity(@PathVariable Integer productId,
                                            @RequestBody Map<String, Object> body,
                                            @AuthenticationPrincipal User user) {
        Integer quantity = parseInt(body.get("quantity"));
        if (quantity == null) return ResponseEntity.badRequest().body(Map.of("error", "quantity required"));

        CartItem item = cartItemRepository.findByUserAndProductProductId(user, productId).orElse(null);
        if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not in cart"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item removed"));
        }
        item.setQuantity(quantity);
        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    // ── DELETE /api/cart/items/{productId}  ───────────────────────────────

    @DeleteMapping("/items/{productId}")
    @Transactional
    public ResponseEntity<?> removeItem(@PathVariable Integer productId,
                                        @AuthenticationPrincipal User user) {
        CartItem item = cartItemRepository.findByUserAndProductProductId(user, productId).orElse(null);
        if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not in cart"));
        cartItemRepository.delete(item);
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }

    // ── DELETE /api/cart  ─────────────────────────────────────────────────

    @DeleteMapping
    @Transactional
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal User user) {
        cartItemRepository.deleteByUser(user);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }

    // ── helpers ───────────────────────────────────────────────────────────
    private static Integer parseInt(Object v) {
        if (v == null) return null;
        try { return Integer.valueOf(v.toString()); } catch (NumberFormatException e) { return null; }
    }
}
