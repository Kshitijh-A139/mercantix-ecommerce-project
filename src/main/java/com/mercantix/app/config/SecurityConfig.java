package com.mercantix.app.config;

import com.mercantix.app.security.JwtAuthenticationFilter;
import com.mercantix.app.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration — stateless JWT.
 *
 * Key decisions:
 * - CSRF disabled:    stateless API, no browser sessions
 * - Sessions NEVER:   every request is authenticated via JWT
 * - Role hierarchy:   ADMIN > CUSTOMER, enforced at URL level
 * - Filter order:     JwtAuthenticationFilter runs BEFORE
 *                     UsernamePasswordAuthenticationFilter
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl  userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthFilter    = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── Disable CSRF (we're stateless) ────────────────────────────
            .csrf(AbstractHttpConfigurer::disable)

            // ── CORS handled by CorsConfig (WebMvcConfigurer) ─────────────
            .cors(cors -> {}) // picks up the CorsConfig bean automatically

            // ── Authorization rules ────────────────────────────────────────
            .authorizeHttpRequests(auth -> auth

                // Public auth endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public registration (also available at /api/auth/register)
                .requestMatchers("/api/users/register").permitAll()

                // Public product browsing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()

                // Admin-only endpoints — Spring checks ROLE_ADMIN authority
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else: authenticated user of any role
                .anyRequest().authenticated()
            )

            // ── Stateless sessions (never create HttpSession) ──────────────
            .sessionManagement(sess ->
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ── Return clean JSON on auth failures (not HTML redirect) ──────
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"error\":\"Unauthorized: " + authException.getMessage() + "\"}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"error\":\"Forbidden: Admin access required\"}"
                    );
                })
            )

            // ── Wire our DaoAuthenticationProvider ────────────────────────
            .authenticationProvider(authenticationProvider())

            // ── JWT filter runs before Spring's UsernamePasswordAuthFilter ─
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes AuthenticationManager so AuthController can call
     * authenticationManager.authenticate(token) for login.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
