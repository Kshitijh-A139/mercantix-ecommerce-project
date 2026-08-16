package com.mercantix.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/**
 * Global CORS configuration.
 * Allowed origins come from CORS_ALLOWED_ORIGINS env var (or app.cors.allowed-origins prop).
 * Per-controller @CrossOrigin annotations should NOT be used — this is the single source of truth.
 */
@Configuration
public class CorsConfig {

    private final String[] allowedOrigins;

    public CorsConfig(@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}") String origins) {
        this.allowedOrigins = Arrays.stream(origins.split("\\s*,\\s*"))
                                    .filter(s -> !s.isBlank())
                                    .toArray(String[]::new);

        // CORS spec: allowCredentials=true is incompatible with "*". Fail fast — this is
        // the kind of misconfiguration that silently breaks login in prod.
        for (String origin : allowedOrigins) {
            if ("*".equals(origin)) {
                throw new IllegalStateException(
                        "CORS allowed-origin '*' is incompatible with allowCredentials=true. " +
                        "List the deployed frontend origin(s) explicitly in CORS_ALLOWED_ORIGINS.");
            }
        }
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
