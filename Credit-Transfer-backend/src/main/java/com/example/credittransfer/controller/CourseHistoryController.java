package com.example.credittransfer.controller;

import com.example.credittransfer.dto.response.CourseHistoryResponse;
import com.example.credittransfer.service.CourseHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
