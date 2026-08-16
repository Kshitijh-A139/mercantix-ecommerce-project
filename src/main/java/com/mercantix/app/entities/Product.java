package com.mercantix.app.entities;

import com.mercantix.app.entities.support.StringListJsonConverter;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_category", columnList = "category"),
        @Index(name = "idx_products_sub_category", columnList = "sub_category")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(nullable = false)
    private String name;

    /** Maker / label shown above the product name in the UI. */
    private String brand;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Was-price for sale strike-through display; null when not discounted. */
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer stock;

    private String category;

    /** Sub-category within a department, e.g. "shirts", "outerwear". */
    @Column(name = "sub_category")
    private String subCategory;

    private String color;

    /** Catalogue rating 0.0–5.0 (one decimal in the UI). */
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    /** Merchandising badge such as "New" or "Best Seller"; null when none. */
    private String tag;

    /** Available sizes, persisted as a JSON array. */
    @Convert(converter = StringListJsonConverter.class)
    @Column(name = "sizes", length = 1000)
    private List<String> sizes = new ArrayList<>();

    /** Gallery image URLs, persisted as a JSON array. */
    @Convert(converter = StringListJsonConverter.class)
    @Column(name = "gallery", length = 2000)
    private List<String> gallery = new ArrayList<>();

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = (sizes == null ? new ArrayList<>() : sizes); }

    public List<String> getGallery() { return gallery; }
    public void setGallery(List<String> gallery) { this.gallery = (gallery == null ? new ArrayList<>() : gallery); }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
