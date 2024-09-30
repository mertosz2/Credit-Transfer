package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersRequest {

    @NotNull(message = "กรุณาใส่ชื่อบัญชีผู้ใช้")
    private String username;

    @NotNull(message = "กรุณาใส่รหัสผ่าน")
    private String password;

    @NotNull(message = "กรุณาใส่ชื่อจริง")
    private String firstName;

    @NotNull(message = "กรุณาใส่นามสกุล")
    private String lastName;

    @NotNull(message = "กรุณาใส่เบอร์โทรศัพท์")
    private String phone;

    @NotNull(message = "กรุณาเลือกตำแหน่ง")
    private Integer role;
}
