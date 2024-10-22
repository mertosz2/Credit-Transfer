package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.UniCourseResponse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.entity.Users;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.RolesRepository;
import com.example.credittransfer.repository.UsersRepository;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.UniversityCourseService;
import jakarta.validation.Valid;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/uni")
@Validated
//@PreAuthorize("hasAnyAuthority('ADMIN')")
public class UniversityCourseController {

    private final UniversityCourseService universityCourseService;

    public UniversityCourseController(UniversityCourseService universityCourseService) {
        this.universityCourseService = universityCourseService;
    }

    @GetMapping("")
    public PagedModel<UniCourseResponse> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size ){
        return universityCourseService.findAll(page, size);
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

    @GetMapping("/")
    public ResponseEntity<UniversityCourse> getCourseByUniCourseId(@RequestParam String uniCourseId) {
        return ResponseEntity.status(OK).body(universityCourseService.findByUniCourseId(uniCourseId));
    }

    @GetMapping("/uniEDropdown")
    public ResponseEntity<List<DropDown>> getEditUniCourseDropdown(){
        return ResponseEntity.status(OK).body(universityCourseService.getEditUniCourseDropdown());
    }

    @GetMapping("/uniCDropdown")
    public ResponseEntity<List<DropDown>> getCreateUniCourseDropdown(){
        return ResponseEntity.status(OK).body(universityCourseService.getCreateUniCourseDropdown());
    }

    @GetMapping("/ccDropdown")
    public ResponseEntity<List<DropDown>> getCourseCategory(){
        return ResponseEntity.status(OK).body(universityCourseService.getCourseCategoryDropdown());
    }

}
