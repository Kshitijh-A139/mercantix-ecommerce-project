package com.mercantix.app.usercontrollers;

import com.mercantix.app.dto.LoginRequest;
import com.mercantix.app.dto.LoginResponse;
import com.mercantix.app.dto.RegisterRequest;
import com.mercantix.app.dto.UserResponse;
import com.mercantix.app.entities.Role;
import com.mercantix.app.entities.User;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.security.JwtService;
import com.mercantix.app.userrepositories.UserRepository;
import com.mercantix.app.userserviceimplementations.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Stateless auth endpoints.
 *
 *   POST /api/auth/login    → returns JWT + lightweight user object
 *   POST /api/auth/register → always creates a CUSTOMER, returns JWT
 *   POST /api/auth/logout   → client-side discard; server confirms
 *   GET  /api/auth/me       → returns the authenticated user (parsed from JWT)
 *
 * CORS is configured globally in {@link com.mercantix.app.config.CorsConfig}.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService            jwtService;
    private final UserService           userService;
    private final UserRepository        userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService            = jwtService;
        this.userService           = userService;
        this.userRepository        = userRepository;
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Bad credentials → BadCredentialsException → GlobalExceptionHandler → 401
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user  = (User) auth.getPrincipal();
        String jwt = jwtService.generateToken(user.getUsername(), user.getRole());

        return ResponseEntity.ok(
                new LoginResponse(jwt, user.getUsername(), user.getEmail(), user.getRole().name())
        );
    }

    // ── POST /api/auth/register ───────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        User u = new User();
        u.setUsername(request.getUsername());
        u.setEmail(request.getEmail());
        u.setPassword(request.getPassword()); // UserService encodes
        // SECURITY: public self-registration always creates a CUSTOMER. Any
        // client-supplied role is ignored — admins are provisioned via DB
        // migration (or a future admin-only endpoint), never by self-signup.
        u.setRole(Role.CUSTOMER);

        User saved = userService.registerUser(u); // throws DuplicateResourceException on conflict

        String jwt = jwtService.generateToken(saved.getUsername(), saved.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new LoginResponse(jwt, saved.getUsername(), saved.getEmail(), saved.getRole().name())
        );
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            // Will be intercepted by SecurityConfig in practice, but defensive
            throw new ResourceNotFoundException("Authenticated user not found");
        }
        // Re-load to get fresh role/email (e.g. if role was changed by admin)
        User fresh = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getUsername()));
        return ResponseEntity.ok(UserResponse.from(fresh));
    }

    // ── POST /api/auth/logout ────────────────────────────────────────────
    // Stateless JWT: server has nothing to invalidate. Client discards token.

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
