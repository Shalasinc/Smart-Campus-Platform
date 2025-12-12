package com.smartcampus.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow specific origins
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",   // Admin Portal
            "http://localhost:3001",   // Unified Portal / Student Portal
            "http://localhost:3002",   // Student Portal
            "http://localhost:3003",   // Professor Portal
            "http://localhost:5173",   // Vite dev server (admin portal)
            "http://localhost:5174",   // Vite dev server (alternative)
            "http://localhost:8080"    // Gateway itself
        ));
        
        // Allow specific HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "OPTIONS", 
            "PATCH",
            "HEAD"
        ));
        
        // Allow specific headers
        corsConfig.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Accept-Encoding",
            "Accept-Language",
            "Cache-Control",
            "Connection",
            "Pragma"
        ));
        
        // Expose response headers
        corsConfig.setExposedHeaders(Arrays.asList(
            "Authorization",
            "X-Total-Count",
            "X-Page-Number",
            "X-Page-Size",
            "Content-Type",
            "Cache-Control"
        ));
        
        // Allow credentials
        corsConfig.setAllowCredentials(true);
        
        // Cache CORS preflight requests
        corsConfig.setMaxAge(3600L);  // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}


