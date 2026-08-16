package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.PageResponse;
import com.mercantix.app.dto.ProductResponse;
import com.mercantix.app.userservices.ProductServiceContract;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Public read-only product endpoints.
 *
 *   GET /api/products            — paginated list with search/filter/sort
 *   GET /api/products/{id}       — single product
 *
 * Admin write operations live in {@link AdminProductController}.
 * Category list lives in {@link CategoryController}.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductServiceContract productService;

    public ProductController(ProductServiceContract productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products
     *
     * Query params (all optional):
     *   q          : keyword search (name + description)
     *   category   : exact category filter (case-insensitive)
     *   minPrice   : inclusive lower bound
     *   maxPrice   : inclusive upper bound
     *   inStock    : true → only stock > 0
     *   page       : 0-based page index (default 0)
     *   size       : page size 1..100 (default 20)
     *   sortBy     : productId | name | price | stock | category | createdAt | updatedAt (default createdAt)
     *   sortDir    : asc | desc (default desc)
     */
    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> list(
            @RequestParam(required = false)                       String     q,
            @RequestParam(required = false)                       String     category,
            @RequestParam(required = false)                       BigDecimal minPrice,
            @RequestParam(required = false)                       BigDecimal maxPrice,
            @RequestParam(required = false)                       Boolean    inStock,
            @RequestParam(required = false, defaultValue = "0")   int        page,
            @RequestParam(required = false, defaultValue = "20")  int        size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc")     String sortDir) {

        return ResponseEntity.ok(productService.search(
                q, category, minPrice, maxPrice, inStock, page, size, sortBy, sortDir
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getById(id));
    }
}
