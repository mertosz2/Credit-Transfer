package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersResponse {

    private Integer userId;

    private String username;

    private String fullName;

    private String phone;

    private String role;
}
