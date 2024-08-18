package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.LoginRequest;
import com.example.credittransfer.service.AuthService;
import com.example.credittransfer.service.AuthenticationService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/login")
@Validated
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }


    @PostMapping("")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.status(OK).body(authenticationService.authenticate(loginRequest));
    }

    @PostMapping("/guest")
    public ResponseEntity<String> loginAsGuest() {
        return ResponseEntity.status(OK).body(authenticationService.authenticate(new LoginRequest()));
    }
}
