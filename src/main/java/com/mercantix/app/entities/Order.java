package com.mercantix.app.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    // User is stored; password excluded via @JsonIgnore in User.java
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "shipping_address", length = 2000)
    private String shippingAddress;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = "PENDING";
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────

    public Integer getOrderId()                   { return orderId; }
    public void    setOrderId(Integer orderId)     { this.orderId = orderId; }

    public User    getUser()                       { return user; }
    public void    setUser(User user)              { this.user = user; }

    public List<OrderItem> getItems()              { return items; }
    public void    setItems(List<OrderItem> items) { this.items = items; }

    public BigDecimal getTotal()                   { return total; }
    public void    setTotal(BigDecimal total)      { this.total = total; }

    public String  getPaymentMethod()              { return paymentMethod; }
    public void    setPaymentMethod(String pm)     { this.paymentMethod = pm; }

    public String  getShippingAddress()            { return shippingAddress; }
    public void    setShippingAddress(String sa)   { this.shippingAddress = sa; }

    public String  getStatus()                     { return status; }
    public void    setStatus(String status)        { this.status = status; }

    public LocalDateTime getCreatedAt()            { return createdAt; }
    public LocalDateTime getUpdatedAt()            { return updatedAt; }
}
