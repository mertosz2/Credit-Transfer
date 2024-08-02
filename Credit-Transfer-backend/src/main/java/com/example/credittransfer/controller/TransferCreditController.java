package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.exception.FileExtensionNotMatchException;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.PDFGeneratorService;
import com.example.credittransfer.service.TransferCreditService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/transfer")
public class TransferCreditController {

    private final TransferCreditService transferCreditService;
    private final PDFGeneratorService pdfGeneratorService;
    private final OCRService ocrService;

    public TransferCreditController(TransferCreditService transferCreditService, PDFGeneratorService pdfGeneratorService, OCRService ocrService) {
        this.transferCreditService = transferCreditService;
        this.pdfGeneratorService = pdfGeneratorService;
        this.ocrService = ocrService;
    }

    @GetMapping("/testRe")
    public ResponseEntity<List<TransferCreditResponse>> getResult(@RequestBody List<TransferCreditRequest> transferCreditRequestList) {
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(transferCreditRequestList));
    }

    @GetMapping("")
    public ResponseEntity<List<TransferCreditResponse>> getAllTransferCourse() {
        return ResponseEntity.status(OK).body(transferCreditService.getAllTransferCourse());
    }

    @GetMapping("/import")
    public ResponseEntity<List<TransferCreditResponse>> importTranscript() {
        List<String> mockId = List.of("30000-9205", "30000-1201", "30000-1207", "30000-9201", "30000-1401", "3221-1055");
        List<TransferCreditRequest> transferCreditRequestList = transferCreditService.mapToTransferCreditRequest(mockId);
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(transferCreditRequestList));
    }

    @GetMapping("/testimp/")
    public ResponseEntity<String> testImportTranscript(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        if(!ocrService.isValidFileExtension(Objects.requireNonNull(multipartFile.getOriginalFilename()))) {
            throw new FileExtensionNotMatchException(multipartFile.getOriginalFilename());
        }
        File file = ocrService.convertFile(multipartFile);
        String fileName = file.getName();

        return ResponseEntity.status(OK).body(fileName);
    }

    @GetMapping("/export-pdf")
    public void exportPdf(HttpServletResponse response){
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=credit-transfer.pdf");
        List<TransferCreditRequest> mockData = List.of(
                new TransferCreditRequest("30001-1055", 4),
                new TransferCreditRequest("30204-2004", 3),
                new TransferCreditRequest("30000-1101", 4),
                new TransferCreditRequest("30000-9205", 4),
                new TransferCreditRequest("30000-9201",2),
                new TransferCreditRequest("30000-1401", 4));

//        List<TransferCreditResponse> mockResponseList = transferCreditService.validateTransferableResponse(
//                transferCreditService.getTransferableCourse(mockData));
        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        System.out.println(mockResponseList);
        try (OutputStream os = response.getOutputStream()) {
            pdfGeneratorService.createPdf(mockResponseList, os);
            os.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/exportExcel")
    public void exportExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=credit-transfer.xlsx";
        response.setHeader(headerKey, headerValue);
        List<TransferCreditRequest> mockData = List.of(
                new TransferCreditRequest("30001-1055", 4),
                new TransferCreditRequest("30204-2004", 3),
                new TransferCreditRequest("30000-1101", 4),
                new TransferCreditRequest("30000-9205", 4),
                new TransferCreditRequest("30000-9201",2),
                new TransferCreditRequest("30000-1401", 4),
                new TransferCreditRequest("31105-4820", 2.5),
                new TransferCreditRequest("31105-4821", 2.5));
        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        transferCreditService.exportExcel(response, mockResponseList);

    }



}
