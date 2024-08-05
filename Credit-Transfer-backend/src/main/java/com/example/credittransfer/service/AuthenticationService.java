package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.LoginRequest;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.repository.UsersRepository;
import com.example.credittransfer.tempf.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(JwtService jwtService, UsersRepository usersRepository, AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
        this.authenticationManager = authenticationManager;
    }

    public String authenticate(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()));

        Users users = usersRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        return jwtService.generateToken(users);
    }
}
