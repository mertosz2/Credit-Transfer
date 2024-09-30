package com.example.credittransfer.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersRequest {


    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String phone;

    private Integer role;
}
