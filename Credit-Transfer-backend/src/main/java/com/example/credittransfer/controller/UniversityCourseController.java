package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.UniversityCourse;
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
@RequestMapping("/api")
@Validated
public class UniversityCourseController {

    private final UniversityCourseService universityCourseService;
    private final OCRService ocrService;

    public UniversityCourseController(UniversityCourseService universityCourseService, OCRService ocrService) {
        this.universityCourseService = universityCourseService;
        this.ocrService = ocrService;
    }

//    @GetMapping("")
//    public List<UniversityCourse> getAll(){
//        return universityCourseService.findAll();
//    }

    @GetMapping("")
    public List<String> getId() throws IOException {
        return ocrService.getCourseId();
    }

    @PostMapping("")
    public ResponseEntity<ResponseAPI> createCourse(@Valid @RequestBody UniversityCourseRequest universityCourseRequest) {
        return ResponseEntity.status(OK).body(universityCourseService.createCourse(universityCourseRequest));
    }


}
