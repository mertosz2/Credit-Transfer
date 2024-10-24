package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.response.DiplomaCourseResponse;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.dto.response.UniCourseResponse;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.service.DiplomaCourseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/dip")
@Validated
//@PreAuthorize("hasAnyAuthority('ADMIN')")
public class DiplomaCourseController {

    private final DiplomaCourseService diplomaCourseService;;

    public DiplomaCourseController(DiplomaCourseService diplomaCourseService) {
        this.diplomaCourseService = diplomaCourseService;
    }

    @GetMapping("")
    public PagedModel<DiplomaCourseResponse> getAllDipCourse(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return diplomaCourseService.getAllDipCourse(page, size);
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

    @GetMapping("/")
    public ResponseEntity<TransferCreditResponse> findByDipCourseId(@RequestParam String dipCourseId) {
        return ResponseEntity.status(OK).body(diplomaCourseService.findByDipCourseId(dipCourseId));

    }

    @PostMapping("/sort")
    public PagedModel<DiplomaCourseResponse> sortData(@RequestBody PagedModel<DiplomaCourseResponse> responseList, @RequestParam("key") String key, @RequestParam("direction") boolean ascending) {
        return diplomaCourseService.sortData(responseList, key, ascending);
    }

    @GetMapping("/search")
    public PagedModel<DiplomaCourseResponse> searchCourse(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10")int size,
                                                      @RequestParam(required = false) String dipCourseId,
                                                      @RequestParam(required = false) String dipCourseName,
                                                      @RequestParam(required = false) String uniCourseId,
                                                      @RequestParam(required = false) String uniCourseName,
                                                      @RequestParam(required = false) Integer dipCredit) {
        return diplomaCourseService.searchCourse(page, size, dipCourseId, dipCourseName, uniCourseId, uniCourseName, dipCredit);
    }

}
