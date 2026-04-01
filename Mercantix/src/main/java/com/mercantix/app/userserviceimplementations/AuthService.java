package com.mercantix.app.userserviceimplementations;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mercantix.app.entities.JWTToken;
import com.mercantix.app.entities.User;
import com.mercantix.app.userrepositories.JWTTokenRepository;
import com.mercantix.app.userrepositories.UserRepository;
import com.mercantix.app.userservices.AuthServiceContract;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService implements AuthServiceContract {

    private final Key SIGNING_KEY;
    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository,
                       JWTTokenRepository jwtTokenRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       @Value("${jwt.secret}") String jwtSecret) {

        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.passwordEncoder = passwordEncoder;

        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalArgumentException(
                "JWT_SECRET must be at least 64 bytes for HS512"
            );
        }

        this.SIGNING_KEY = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public User authenticate(String username, String password) {

        // 🚨 HARD VALIDATION (THIS WAS MISSING)
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }
    
    @Override
    public String generateToken(User user) {

        String token;
        LocalDateTime now = LocalDateTime.now();

        Optional<JWTToken> optionalToken =
                jwtTokenRepository.findTopByUserOrderByExpiresAtDesc(user);

        JWTToken existingToken = optionalToken.orElse(null);

        if (existingToken != null && now.isBefore(existingToken.getExpiresAt())) {
            token = existingToken.getToken();
        } else {
            token = generateNewToken(user);

            if (existingToken != null) {
                jwtTokenRepository.delete(existingToken);
            }

            saveToken(user, token);
        }

        return token;
    }

    @Override
    public String generateNewToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    @Override
    public void saveToken(User user, String token) {
        JWTToken jwtToken = new JWTToken(
                user,
                token,
                LocalDateTime.now().plusHours(1)
        );
        jwtTokenRepository.save(jwtToken);
    }
    
    @Override
    public boolean validateToken(String token) {
        try {
            System.err.println("VALIDATING TOKEN...");

            // Parse and validate the token
            Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token);

            // Check if the token exists in the database and is not expired
            Optional<JWTToken> jwtToken = jwtTokenRepository.findByToken(token);
            if (jwtToken.isPresent()) {
                System.err.println("Token Expiry: " + jwtToken.get().getExpiresAt());
                System.err.println("Current Time: " + LocalDateTime.now());
                return jwtToken.get().getExpiresAt().isAfter(LocalDateTime.now());
            }

            return false;
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}