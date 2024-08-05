package com.example.credittransfer.config;

import com.example.credittransfer.entity.UserSecurity;
import com.example.credittransfer.entity.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final String SECRET_KEY = "asdadsada)(!*$&(@&(@SJADKSDKN*#HRasdasdasd";

    public Claims extractAllClaims(String token) {
        return (Claims) Jwts.parserBuilder().setSigningKey(SECRET_KEY.getBytes()).build().parse(token).getBody();
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaims(token,Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaims(token,Claims::getExpiration);
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    public String createToken(Map<String, Object> claims, String subject) {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");
        header.put("alg", "HS256");

        return Jwts.builder()
                .setHeader(header)
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(60)))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(Users users) {
        String fullName = users.getFirstName() + " " + users.getLastName();
        List<String> authorities = new UserSecurity(users).getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", users.getUsersId());
        claims.put("user_name", users.getUsername());
        claims.put("name", fullName);
        claims.put("role", authorities);
        return createToken(claims, users.getUsername());
    }

    List<GrantedAuthority> getAuthorities(String token) {
        List<String> grantedAuthorities = extractClaims(token, claims -> claims.get("role", List.class));
        return  grantedAuthorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

    }

}
