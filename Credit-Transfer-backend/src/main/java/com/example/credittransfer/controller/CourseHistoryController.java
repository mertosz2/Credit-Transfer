package com.example.credittransfer.controller;

import com.example.credittransfer.dto.response.CourseHistoryResponse;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.service.CourseHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/api/history")
public class CourseHistoryController {

    private final CourseHistoryService courseHistoryService;

    public CourseHistoryController(CourseHistoryService courseHistoryService) {
        this.courseHistoryService = courseHistoryService;
    }

    @GetMapping("")
    public ResponseEntity<List<CourseHistoryResponse>> getAllHistory(){
        return ResponseEntity.ok(courseHistoryService.getAllHistory());
    }

    @PostMapping("")
    public ResponseEntity<ResponseAPI> saveHistory(@RequestBody List<TransferCreditResponse> transferCreditResponseList) {
        return ResponseEntity.status(CREATED).body(courseHistoryService.saveHistory(transferCreditResponseList));
    }
}
