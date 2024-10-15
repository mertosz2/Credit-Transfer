package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.UsersRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.UsersResponse;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.service.UsersService;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/users")
//@PreAuthorize("hasAnyAuthority('ADMIN')")
public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/roleDropdown")
    public List<DropDown> getRoleDropdown() {
        return usersService.getRoleDropdown();
    }

    @GetMapping("")
    public PagedModel<UsersResponse> getAllUsers(@RequestParam(defaultValue = "0")int page, @RequestParam(defaultValue = "10")int size) {
        return usersService.getAllUser(page, size);
    }

    @PostMapping("")
    public ResponseEntity<ResponseAPI> createUser(@RequestBody UsersRequest usersRequest) {
        return ResponseEntity.status(CREATED).body(usersService.createUser(usersRequest));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ResponseAPI> updateUser(@RequestBody UsersRequest usersRequest, @PathVariable Integer userId) {
        return ResponseEntity.status(CREATED).body(usersService.updateUser(usersRequest, userId));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ResponseAPI> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.status(OK).body(usersService.deleteUser(userId));
    }
}
