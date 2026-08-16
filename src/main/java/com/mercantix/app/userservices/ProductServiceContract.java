package com.mercantix.app.userservices;

import com.mercantix.app.dto.PageResponse;
import com.mercantix.app.dto.ProductRequest;
import com.mercantix.app.dto.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Public contract for the product domain. Controllers depend on this interface only.
 */
public interface ProductServiceContract {

    // ── Read ──────────────────────────────────────────────────────────────

    PageResponse<ProductResponse> search(String q,
                                         String category,
                                         BigDecimal minPrice,
                                         BigDecimal maxPrice,
                                         Boolean inStock,
                                         int page,
                                         int size,
                                         String sortBy,
                                         String sortDir);

    ProductResponse getById(Integer id);

    List<String> listCategories();

    // ── Write (admin only) ────────────────────────────────────────────────

    ProductResponse create(ProductRequest request);

    ProductResponse update(Integer id, ProductRequest request);

    void delete(Integer id);
}
