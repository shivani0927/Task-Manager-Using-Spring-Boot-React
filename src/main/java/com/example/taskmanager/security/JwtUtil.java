package com.example.taskmanager.security;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username, Set<String> roles) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("roles", roles);
        long now = System.currentTimeMillis();
        // Builder is fine
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            // FIX: Replaced parserBuilder() with parser()
            Jwts.parser().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getUsername(String token) {
        // FIX: Replaced parserBuilder() with parser()
        return Jwts.parser().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public Set<String> getRoles(String token) {
        // FIX: Replaced parserBuilder() with parser()
        Object roles = Jwts.parser().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().get("roles");
        if (roles instanceof Collection) {
            return ((Collection<?>)roles).stream().map(Object::toString).collect(Collectors.toSet());
        }
        return Collections.emptySet();
    }
}