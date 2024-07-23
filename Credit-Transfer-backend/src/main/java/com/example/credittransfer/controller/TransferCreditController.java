package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.service.TransferCreditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/transfer")
public class TransferCreditController {

    private final TransferCreditService transferCreditService;

    public TransferCreditController(TransferCreditService transferCreditService) {
        this.transferCreditService = transferCreditService;
    }

    @GetMapping("")
    public ResponseEntity<List<TransferCreditResponse>> getResult(@RequestBody List<TransferCreditRequest> transferCreditRequestList) {
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(transferCreditRequestList));
    }

    @GetMapping("/import")
    public ResponseEntity<List<TransferCreditResponse>> importTranscript() {
        List<String> dipCourseIdList  = List.of("30000-9205", "30000-1201", "30000-1207", "30000-9201");
        return ResponseEntity.status(OK).body(
                transferCreditService.getTransferableCourse(TransferCreditService.mapToTransferCreditRequestList(dipCourseIdList)));

    }
}
