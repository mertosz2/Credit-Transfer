package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.DepartmentRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@PreAuthorize("hasAnyAuthority('SUPER_ADMIN')")
@RequestMapping("/api/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/departDd")
    public ResponseEntity<List<DropDown>> getDepartmentDropdown() {
        return ResponseEntity.status(OK).body(departmentService.getDepartmentDropdown());
    }

    @PostMapping("")
    public ResponseEntity<ResponseAPI> createDepartment(DepartmentRequest departmentRequest) {
        return ResponseEntity.status(CREATED).body(departmentService.createDepartment(departmentRequest));
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<ResponseAPI> editDepartment(DepartmentRequest departmentRequest, @PathVariable Integer departmentId) {
        return ResponseEntity.status(OK).body(departmentService.editDepartment(departmentId, departmentRequest));

    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<ResponseAPI> deleteDepartment(@PathVariable Integer departmentId) {
        return ResponseEntity.status(OK).body(departmentService.deleteDepartment(departmentId));
    }

}
