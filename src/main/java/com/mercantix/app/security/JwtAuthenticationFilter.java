package com.mercantix.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Stateless JWT filter — runs once per request.
 *
 * Flow:
 *   1. Extract Bearer token from Authorization header
 *   2. Validate signature + expiry (NO DB call here)
 *   3. Extract username from token
 *   4. Load user from DB (single DB call, only when SecurityContext is empty)
 *   5. Set authentication into SecurityContextHolder
 *   6. Spring Security enforces access rules from SecurityConfig
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService            jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserDetailsServiceImpl userDetailsService) {
        this.jwtService         = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest  request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain         chain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // ── No token → pass through; SecurityConfig will block if route needs auth ──
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7).trim();

        // ── Structurally invalid or expired token → pass through ──
        if (!jwtService.isTokenStructurallyValid(token)) {
            log.debug("JWT invalid or expired for request: {} {}", request.getMethod(), request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        final String username = jwtService.extractUsername(token);

        // ── Only populate SecurityContext if not already authenticated ──
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Single DB call per request (not per token validation)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated user '{}' for {} {}", username,
                            request.getMethod(), request.getRequestURI());
                }
            } catch (Exception e) {
                log.warn("Could not authenticate user '{}': {}", username, e.getMessage());
                // Don't set auth — SecurityConfig will handle the 401/403
            }
        }

        chain.doFilter(request, response);
    }
}
