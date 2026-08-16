package com.mercantix.app.security;

import com.mercantix.app.entities.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Pure stateless JWT service.
 * No DB reads. Signs, validates and parses tokens using HMAC-SHA512.
 */
@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMs;

    private static final String DEV_DEFAULT_SECRET =
            "dev-only-please-change-secret-64-bytes-or-more-aaaaaaaaaaaaaaaaaaaaa";

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs,
            Environment env) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            throw new IllegalStateException(
                    "jwt.secret must be at least 64 bytes for HS512. Current length: "
                    + keyBytes.length);
        }

        // In prod, refuse to start with the dev default secret.
        boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");
        if (isProd && DEV_DEFAULT_SECRET.equals(secret)) {
            throw new IllegalStateException(
                    "JWT_SECRET environment variable is not set. Refusing to start in prod profile " +
                    "with the dev default secret. Generate one with: " +
                    "openssl rand -base64 64");
        }

        this.signingKey   = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    // ── Generate ─────────────────────────────────────────────────────────

    public String generateToken(String username, Role role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.name());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // ── Validate ─────────────────────────────────────────────────────────

    /**
     * Validates token: checks signature, expiry, and that the subject matches
     * the provided UserDetails. Called inside the filter after loading the user.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Lightweight validate — only checks signature + expiry.
     * Called before loading user to avoid unnecessary DB query.
     */
    public boolean isTokenStructurallyValid(String token) {
        try {
            extractAllClaims(token);
            return !isExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Extract ──────────────────────────────────────────────────────────

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private boolean isExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
