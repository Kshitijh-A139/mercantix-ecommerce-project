package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.ProductRequest;
import com.mercantix.app.dto.ProductResponse;
import com.mercantix.app.userservices.ProductServiceContract;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin-only product CRUD.
 * Class-level {@code @PreAuthorize} doubles up the URL-level rule in SecurityConfig.
 *
 *   POST   /api/admin/products       — create
 *   PUT    /api/admin/products/{id}  — partial update (null = leave unchanged)
 *   DELETE /api/admin/products/{id}  — delete
 */
@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductServiceContract productService;

    public AdminProductController(ProductServiceContract productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Integer id,
                                                  @RequestBody ProductRequest request) {
        // @Valid omitted intentionally: PUT supports partial updates with null fields.
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}
