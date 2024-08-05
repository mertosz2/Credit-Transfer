package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.UniversityCourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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

    public UniversityCourseController(UniversityCourseService universityCourseService, OCRService ocrService) {
        this.universityCourseService = universityCourseService;
        this.ocrService = ocrService;
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
