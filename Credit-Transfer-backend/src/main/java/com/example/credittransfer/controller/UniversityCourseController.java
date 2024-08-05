package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.RolesRepository;
import com.example.credittransfer.repository.UsersRepository;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.UniversityCourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/uni")
@Validated
public class UniversityCourseController {

    private final UniversityCourseService universityCourseService;
    private final OCRService ocrService;
    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RolesRepository rolesRepository;

    public UniversityCourseController(UniversityCourseService universityCourseService, OCRService ocrService, UsersRepository usersRepository, BCryptPasswordEncoder bCryptPasswordEncoder, RolesRepository rolesRepository) {
        this.universityCourseService = universityCourseService;
        this.ocrService = ocrService;
        this.usersRepository = usersRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.rolesRepository = rolesRepository;
    }

    @GetMapping("")
    public ResponseEntity<List<UniversityCourse>> getAll(){
        return ResponseEntity.status(OK).body(universityCourseService.findAll());
    }


    @PostMapping("")
    public ResponseEntity<ResponseAPI> createCourse(@Valid @RequestBody UniversityCourseRequest universityCourseRequest) {
        return ResponseEntity.status(OK).body(universityCourseService.createCourse(universityCourseRequest));
    }

    @PutMapping("/{uniId}")
    public ResponseEntity<ResponseAPI> updateCourse(@PathVariable Integer uniId, @Valid @RequestBody UniversityCourseRequest universityCourseRequest) {
        return ResponseEntity.status(OK).body(universityCourseService.updateCourse(universityCourseRequest, uniId));
    }

    @DeleteMapping("/{uniId}")
    public ResponseEntity<ResponseAPI> deleteCourse(@PathVariable Integer uniId) {
        return ResponseEntity.status(OK).body(universityCourseService.deleteUniCourse(uniId));
    }

    @GetMapping("/{uniId}")
    public ResponseEntity<UniversityCourse> getCourseByUniId(@PathVariable Integer uniId) {
        return ResponseEntity.status(OK).body(universityCourseService.findByUniId(uniId));
    }

    @GetMapping("/uniDropdown")
    public ResponseEntity<List<DropDown>> getUniCourseDropdown(){
        return ResponseEntity.status(OK).body(universityCourseService.getUniCourseDropdown());
    }

}
