package com.example.credittransfer.utility;

import com.example.credittransfer.entity.UserSecurity;
import com.example.credittransfer.entity.Users;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utility {

    public static Users getUserPrincipal() {
        UserSecurity userSecurity = (UserSecurity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userSecurity.getUsers();
    }
}
