package com.mercantix.app.dto;

import com.mercantix.app.entities.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response shape for product reads. Decouples the API contract from the JPA entity
 * and carries every field the storefront UI renders (brand, rating, sizes, gallery…).
 */
public class ProductResponse {

    private final Integer       productId;
    private final String        name;
    private final String        brand;
    private final String        description;
    private final BigDecimal    price;
    private final BigDecimal    originalPrice;
    private final Integer       stock;
    private final boolean       inStock;
    private final String        category;
    private final String        subCategory;
    private final String        color;
    private final BigDecimal    rating;
    private final Integer       reviewCount;
    private final String        tag;
    private final List<String>  sizes;
    private final List<String>  gallery;
    private final String        imageUrl;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private ProductResponse(Product p) {
        this.productId     = p.getProductId();
        this.name          = p.getName();
        this.brand         = p.getBrand();
        this.description   = p.getDescription();
        this.price         = p.getPrice();
        this.originalPrice = p.getOriginalPrice();
        this.stock         = p.getStock();
        this.inStock       = p.getStock() != null && p.getStock() > 0;
        this.category      = p.getCategory();
        this.subCategory   = p.getSubCategory();
        this.color         = p.getColor();
        this.rating        = p.getRating();
        this.reviewCount   = p.getReviewCount();
        this.tag           = p.getTag();
        this.sizes         = p.getSizes();
        this.gallery       = p.getGallery();
        this.imageUrl      = p.getImageUrl();
        this.createdAt     = p.getCreatedAt();
        this.updatedAt     = p.getUpdatedAt();
    }

    public static ProductResponse from(Product p) {
        return new ProductResponse(p);
    }

    public Integer       getProductId()     { return productId; }
    public String        getName()          { return name; }
    public String        getBrand()         { return brand; }
    public String        getDescription()   { return description; }
    public BigDecimal    getPrice()         { return price; }
    public BigDecimal    getOriginalPrice() { return originalPrice; }
    public Integer       getStock()         { return stock; }
    public boolean       isInStock()        { return inStock; }
    public String        getCategory()      { return category; }
    public String        getSubCategory()   { return subCategory; }
    public String        getColor()         { return color; }
    public BigDecimal    getRating()        { return rating; }
    public Integer       getReviewCount()   { return reviewCount; }
    public String        getTag()           { return tag; }
    public List<String>  getSizes()         { return sizes; }
    public List<String>  getGallery()       { return gallery; }
    public String        getImageUrl()      { return imageUrl; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getUpdatedAt()     { return updatedAt; }
}
