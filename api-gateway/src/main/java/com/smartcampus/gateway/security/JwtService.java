package com.smartcampus.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private final Key key;

    public JwtService(@Value("${security.jwt.secret}") String secret) {
        // Ensure the key is at least 256 bits (32 bytes) for HS256
        // Use same padding logic as auth-service
        byte[] keyBytes = secret.getBytes();
        if (keyBytes.length < 32) {
            byte[] paddedKeyBytes = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKeyBytes, 0, keyBytes.length);
            // Fill the rest with zeros (same as auth-service)
            for (int i = keyBytes.length; i < 32; i++) {
                paddedKeyBytes[i] = (byte) '0';
            }
            this.key = Keys.hmacShaKeyFor(paddedKeyBytes);
        } else {
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Optional<Claims> parseClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return Optional.of(claims);
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}

