package com.mercantix.app.dto;

/**
 * Returned by POST /api/auth/login
 * Contains the JWT and a lightweight user object for the frontend.
 */
public class LoginResponse {

    private final String token;
    private final UserInfo user;

    public LoginResponse(String token, String username, String email, String role) {
        this.token = token;
        this.user  = new UserInfo(username, email, role);
    }

    public String   getToken() { return token; }
    public UserInfo getUser()  { return user; }

    // ── Nested DTO (keeps response flat and safe — no password leaked) ──

    public static class UserInfo {
        private final String username;
        private final String email;
        private final String role;

        public UserInfo(String username, String email, String role) {
            this.username = username;
            this.email    = email;
            this.role     = role;
        }

        public String getUsername() { return username; }
        public String getEmail()    { return email; }
        public String getRole()     { return role; }
    }
}
