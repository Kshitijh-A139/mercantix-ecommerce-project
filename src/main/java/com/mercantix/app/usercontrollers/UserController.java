package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.UserResponse;
import com.mercantix.app.userrepositories.ProductRepository;
import com.mercantix.app.userrepositories.UserRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * User management endpoints.
 * Registration is handled by AuthController (/api/auth/register).
 * Admin-level user queries live here under /api/admin/**.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository    userRepository;
    private final ProductRepository productRepository;

    public UserController(UserRepository userRepository,
                          ProductRepository productRepository) {
        this.userRepository    = userRepository;
        this.productRepository = productRepository;
    }

    // ── GET /api/admin/users ──────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll(Sort.by("createdAt").descending())
                .stream()
                .map(UserResponse::from)
                .toList();
        return ResponseEntity.ok(users);
    }

    // ── GET /api/admin/stats ──────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalUsers    = userRepository.count();
        long totalProducts = productRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalUsers",    totalUsers,
                "totalProducts", totalProducts
        ));
    }
}
