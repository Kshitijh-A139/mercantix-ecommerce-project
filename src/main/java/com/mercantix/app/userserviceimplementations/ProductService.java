package com.mercantix.app.userserviceimplementations;

import com.mercantix.app.dto.PageResponse;
import com.mercantix.app.dto.ProductRequest;
import com.mercantix.app.dto.ProductResponse;
import com.mercantix.app.entities.Product;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.userrepositories.ProductRepository;
import com.mercantix.app.userservices.ProductServiceContract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
public class ProductService implements ProductServiceContract {

    /** Whitelist of fields the API allows sorting on — prevents SQL injection via sortBy. */
    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("productId", "name", "brand", "price", "stock", "category",
                   "rating", "reviewCount", "createdAt", "updatedAt");

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ── Read ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(String q,
                                                String category,
                                                BigDecimal minPrice,
                                                BigDecimal maxPrice,
                                                Boolean inStock,
                                                int page,
                                                int size,
                                                String sortBy,
                                                String sortDir) {

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 100),     // clamp 1..100
                buildSort(sortBy, sortDir)
        );

        Page<Product> result = productRepository.search(
                blankToNull(q),
                blankToNull(category),
                minPrice,
                maxPrice,
                inStock,
                pageable
        );

        return PageResponse.of(result, ProductResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Integer id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> listCategories() {
        return productRepository.findDistinctCategories();
    }

    // ── Write ─────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        p.setName(req.getName());
        p.setBrand(req.getBrand());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setOriginalPrice(req.getOriginalPrice());
        p.setStock(req.getStock());
        p.setCategory(req.getCategory());
        p.setSubCategory(req.getSubCategory());
        p.setColor(req.getColor());
        p.setRating(req.getRating());
        p.setReviewCount(req.getReviewCount());
        p.setTag(req.getTag());
        if (req.getSizes() != null)   p.setSizes(req.getSizes());
        if (req.getGallery() != null) p.setGallery(req.getGallery());
        p.setImageUrl(req.getImageUrl());
        return ProductResponse.from(productRepository.save(p));
    }

    @Override
    @Transactional
    public ProductResponse update(Integer id, ProductRequest req) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (req.getName()          != null) existing.setName(req.getName());
        if (req.getBrand()         != null) existing.setBrand(req.getBrand());
        if (req.getDescription()   != null) existing.setDescription(req.getDescription());
        if (req.getPrice()         != null) existing.setPrice(req.getPrice());
        if (req.getOriginalPrice() != null) existing.setOriginalPrice(req.getOriginalPrice());
        if (req.getStock()         != null) existing.setStock(req.getStock());
        if (req.getCategory()      != null) existing.setCategory(req.getCategory());
        if (req.getSubCategory()   != null) existing.setSubCategory(req.getSubCategory());
        if (req.getColor()         != null) existing.setColor(req.getColor());
        if (req.getRating()        != null) existing.setRating(req.getRating());
        if (req.getReviewCount()   != null) existing.setReviewCount(req.getReviewCount());
        if (req.getTag()           != null) existing.setTag(req.getTag());
        if (req.getSizes()         != null) existing.setSizes(req.getSizes());
        if (req.getGallery()       != null) existing.setGallery(req.getGallery());
        if (req.getImageUrl()      != null) existing.setImageUrl(req.getImageUrl());

        return ProductResponse.from(productRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private Sort buildSort(String sortBy, String sortDir) {
        String field = (sortBy == null || !ALLOWED_SORT_FIELDS.contains(sortBy)) ? "createdAt" : sortBy;
        Sort.Direction dir = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, field);
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
