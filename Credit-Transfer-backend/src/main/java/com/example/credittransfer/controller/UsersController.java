package com.example.credittransfer.controller;

import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.service.UsersService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasAnyAuthority('ADMIN')")
public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/roleDropdown")
    private List<DropDown> getRoleDropdown() {
        return usersService.getRoleDropdown();
    }
}
