package com.mercantix.app.dto;

import com.mercantix.app.entities.User;

import java.time.LocalDateTime;

/**
 * Safe, password-free projection of a User — used by /api/auth/me, /api/users, /api/admin/customers.
 */
public class UserResponse {

    private final Integer       userId;
    private final String        username;
    private final String        email;
    private final String        role;
    private final LocalDateTime createdAt;

    public UserResponse(Integer userId, String username, String email, String role, LocalDateTime createdAt) {
        this.userId    = userId;
        this.username  = username;
        this.email     = email;
        this.role      = role;
        this.createdAt = createdAt;
    }

    public static UserResponse from(User u) {
        return new UserResponse(
                u.getUserId(),
                u.getUsername(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getCreatedAt()
        );
    }

    public Integer       getUserId()    { return userId; }
    public String        getUsername()  { return username; }
    public String        getEmail()     { return email; }
    public String        getRole()      { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
