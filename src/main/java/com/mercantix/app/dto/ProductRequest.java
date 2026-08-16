package com.mercantix.app.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request body for POST /api/admin/products and PUT /api/admin/products/{id}.
 * For PUT, null fields are interpreted as "leave unchanged" (partial update).
 */
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @Size(max = 255, message = "Brand must not exceed 255 characters")
    private String brand;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 2 decimal places")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = false, message = "Original price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Original price must have at most 2 decimal places")
    private BigDecimal originalPrice;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @Size(max = 100, message = "Sub-category must not exceed 100 characters")
    private String subCategory;

    @Size(max = 100, message = "Color must not exceed 100 characters")
    private String color;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.0")
    @Digits(integer = 1, fraction = 2, message = "Rating must be between 0.0 and 5.0")
    private BigDecimal rating;

    @Min(value = 0, message = "Review count cannot be negative")
    private Integer reviewCount;

    @Size(max = 50, message = "Tag must not exceed 50 characters")
    private String tag;

    private List<@Size(max = 50) String> sizes;

    private List<@Size(max = 500) String> gallery;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    public ProductRequest() {}

    public String     getName()          { return name; }
    public void       setName(String name) { this.name = name; }

    public String     getBrand()         { return brand; }
    public void       setBrand(String brand) { this.brand = brand; }

    public String     getDescription()   { return description; }
    public void       setDescription(String description) { this.description = description; }

    public BigDecimal getPrice()         { return price; }
    public void       setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void       setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer    getStock()         { return stock; }
    public void       setStock(Integer stock) { this.stock = stock; }

    public String     getCategory()      { return category; }
    public void       setCategory(String category) { this.category = category; }

    public String     getSubCategory()   { return subCategory; }
    public void       setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String     getColor()         { return color; }
    public void       setColor(String color) { this.color = color; }

    public BigDecimal getRating()        { return rating; }
    public void       setRating(BigDecimal rating) { this.rating = rating; }

    public Integer    getReviewCount()   { return reviewCount; }
    public void       setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String     getTag()           { return tag; }
    public void       setTag(String tag) { this.tag = tag; }

    public List<String> getSizes()       { return sizes; }
    public void       setSizes(List<String> sizes) { this.sizes = sizes; }

    public List<String> getGallery()     { return gallery; }
    public void       setGallery(List<String> gallery) { this.gallery = gallery; }

    public String     getImageUrl()      { return imageUrl; }
    public void       setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
