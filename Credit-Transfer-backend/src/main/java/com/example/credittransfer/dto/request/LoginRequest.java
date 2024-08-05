package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotNull(message = "username can not be null or empty")
    private String username;

    @NotNull(message = "password can not be null or empty")
    private String password;
}
