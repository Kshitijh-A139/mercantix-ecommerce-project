package com.mercantix.app.usercontrollers;

import com.mercantix.app.userservices.ProductServiceContract;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public category endpoint. Categories are derived from the distinct set of
 * {@code products.category} values (denormalized by design — see db/migration).
 *
 *   GET /api/categories — sorted, distinct, non-blank category names
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ProductServiceContract productService;

    public CategoryController(ProductServiceContract productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<String>> list() {
        return ResponseEntity.ok(productService.listCategories());
    }
}
