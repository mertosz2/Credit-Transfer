package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.service.DiplomaCourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/dip")
@Validated
public class DiplomaCourseController {

    private final DiplomaCourseService diplomaCourseService;;

    public DiplomaCourseController(DiplomaCourseService diplomaCourseService) {
        this.diplomaCourseService = diplomaCourseService;
    }

    @GetMapping("")
    public ResponseEntity<List<DiplomaCourse>> getAllDipCourse() {
        return ResponseEntity.status(OK).body(diplomaCourseService.getAllDipCourse());
    }

    @PutMapping("/{dipId}")
    public ResponseEntity<ResponseAPI> updateDipCourse(@PathVariable Integer dipId, @RequestBody DiplomaCourseRequest request) {
        return ResponseEntity.status(OK).body(diplomaCourseService.updateCourse(request, dipId));
    }

    @PostMapping("")
    public ResponseEntity<ResponseAPI> createCourse(@Valid @RequestBody DiplomaCourseRequest diplomaCourseRequest) {
        return ResponseEntity.status(OK).body(diplomaCourseService.createCourse(diplomaCourseRequest));
    }

    @DeleteMapping("/{dipId}")
    public ResponseEntity<ResponseAPI> deleteDipCourse(@PathVariable Integer dipId) {
        return ResponseEntity.status(OK).body(diplomaCourseService.deleteDipCourse(dipId));
    }

    @GetMapping("/{dipId}")
    public ResponseEntity<DiplomaCourse> findByDipId(@PathVariable Integer dipId) {
        return ResponseEntity.status(OK).body(diplomaCourseService.findByDipId(dipId));
    }


//    @GetMapping("/test")
//    public ResponseEntity<String> testvalidate(){
//        List<String> mockId = List.of("30000-9205", "30000-1201", "30000-1267", "30000-9221", "30000-1401", "3221-1895");
//        return ResponseEntity.status(OK).body(diplomaCourseService.validateDipCourseId(mockId));
//    }
}
