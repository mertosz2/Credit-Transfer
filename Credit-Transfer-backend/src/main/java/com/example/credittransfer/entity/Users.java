package com.example.credittransfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int usersId;

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String phone;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Roles role;

}
