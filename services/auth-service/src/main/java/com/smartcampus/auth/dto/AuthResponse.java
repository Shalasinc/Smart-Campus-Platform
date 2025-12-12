package com.smartcampus.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("jwtToken")
    private String jwtToken;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("userId")
    private Long userId;

    // Constructor for backward compatibility
    public AuthResponse(String token, Object role, String username) {
        this.token = token;
        this.jwtToken = token;
        this.username = username;
        this.role = role != null ? role.toString() : "STUDENT";
        this.userId = null;
    }

    public AuthResponse(String token, Object role, String username, Long userId) {
        this.token = token;
        this.jwtToken = token;
        this.username = username;
        this.role = role != null ? role.toString() : "STUDENT";
        this.userId = userId;
    }
}

