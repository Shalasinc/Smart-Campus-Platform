package com.smartcampus.gateway.security;

import io.jsonwebtoken.Claims;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtService jwtService;
    
    // Public endpoints that don't require authentication
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/auth/ping"
    );

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        // Allow CORS preflight requests
        if ("OPTIONS".equals(method)) {
            return chain.filter(exchange);
        }

        // Allow public endpoints
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = header.substring(7);
        Claims claims = jwtService.parseClaims(token).orElse(null);
        if (claims == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String roles = String.valueOf(claims.get("roles"));
        if (isForbidden(path, method, roles)) {
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            return exchange.getResponse().setComplete();
        }

        // Propagate identity to downstream services for tenant scoping
        String tenant = String.valueOf(claims.get("tenant_id"));
        String userId = claims.getSubject();
        ServerHttpRequest mutated = request.mutate()
                .header("X-User-Id", userId)
                .header("X-Tenant-Id", tenant)
                .header("X-Roles", roles)
                .build();

        return chain.filter(exchange.mutate().request(mutated).build());
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private boolean isForbidden(String path, String method, String roles) {
        if (path.startsWith("/api/users") && !roles.contains("ADMIN")) {
            return true;
        }
        if (path.startsWith("/api/courses") && "POST".equals(method)
                && !(roles.contains("ADMIN") || roles.contains("PROFESSOR"))) {
            return true;
        }
        if (path.contains("/submit") && !roles.contains("STUDENT")) {
            return true;
        }
        return false;
    }
}

