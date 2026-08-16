package com.mercantix.app.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Integer cartItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    public void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────

    public Integer  getCartItemId()                  { return cartItemId; }
    public void     setCartItemId(Integer id)        { this.cartItemId = id; }

    public User     getUser()                        { return user; }
    public void     setUser(User user)               { this.user = user; }

    public Product  getProduct()                     { return product; }
    public void     setProduct(Product product)      { this.product = product; }

    public Integer  getQuantity()                    { return quantity; }
    public void     setQuantity(Integer quantity)    { this.quantity = quantity; }

    public BigDecimal getUnitPrice()                 { return unitPrice; }
    public void     setUnitPrice(BigDecimal price)   { this.unitPrice = price; }

    public LocalDateTime getAddedAt()                { return addedAt; }
}
