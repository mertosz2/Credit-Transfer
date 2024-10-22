package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersRequest {

    @NotBlank(message = "กรุณาใส่ชื่อบัญชีผู้ใช้")
    private String username;

    @NotBlank(message = "กรุณาใส่รหัสผ่าน")
    private String password;

    @NotBlank(message = "กรุณาใส่ชื่อจริง")
    private String firstName;

    @NotBlank(message = "กรุณาใส่นามสกุล")
    private String lastName;

    @NotBlank(message = "กรุณาใส่เบอร์โทรศัพท์")
    private String phone;

    @NotBlank(message = "กรุณาเลือกตำแหน่ง")
    private Integer role;
}
