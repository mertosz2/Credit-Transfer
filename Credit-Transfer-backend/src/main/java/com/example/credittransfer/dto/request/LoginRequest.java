package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotNull(message = "กรุณาใส่บัญชีผู้ใช้")
    private String username;

    @NotNull(message = "กรุณาใส่รหัสผ่าน")
    private String password;
}
