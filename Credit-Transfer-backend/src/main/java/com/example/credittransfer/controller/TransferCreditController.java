package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.DipCourseIdResponse;
import com.example.credittransfer.dto.response.ReportCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.exception.FileEmptyException;
import com.example.credittransfer.exception.FileExtensionNotMatchException;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.service.CourseHistoryService;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.PDFGeneratorService;
import com.example.credittransfer.service.TransferCreditService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/transfer")
public class TransferCreditController {

    private final TransferCreditService transferCreditService;
    private final OCRService ocrService;
    private final CourseHistoryService courseHistoryService;
    private final DiplomaCourseRepository diplomaCourseRepository;
    private final PDFGeneratorService pdfGeneratorService;

    public TransferCreditController(TransferCreditService transferCreditService, OCRService ocrService, CourseHistoryService courseHistoryService, DiplomaCourseRepository diplomaCourseRepository, PDFGeneratorService pdfGeneratorService) {
        this.transferCreditService = transferCreditService;
        this.ocrService = ocrService;
        this.courseHistoryService = courseHistoryService;
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @GetMapping("")
    public ResponseEntity<List<TransferCreditResponse>> getAllTransferCourse() {
        return ResponseEntity.status(OK).body(transferCreditService.getAllTransferCourse());
    }

    @PostMapping("/import/")
    public ResponseEntity<DipCourseIdResponse> testImportTranscript(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        if (!ocrService.isValidFileExtension(Objects.requireNonNull(multipartFile.getOriginalFilename()))) {
            throw new FileExtensionNotMatchException(multipartFile.getOriginalFilename());
        }
        if (multipartFile.getSize() == 0) {
            throw new FileEmptyException();
        }
        File file = ocrService.convertFile(multipartFile);
        DipCourseIdResponse dipCourseIdResponse = ocrService.getCourseIdByImport(file);
        file.delete();
        List<TransferCreditRequest> transferCreditRequestList = transferCreditService.mapToTransferCreditRequest(dipCourseIdResponse.getFoundedDipCourseIdList());
        dipCourseIdResponse.setTransferCreditResponseList(transferCreditService.getTransferableCourse(transferCreditRequestList));

        return ResponseEntity.status(OK).body(dipCourseIdResponse);
    }

    @GetMapping("/ttp")
    public ResponseEntity<List<TransferCreditResponse>> testNer() {
        List<TransferCreditRequest> mockData = List.of(
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30001-1055"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2004"), 3),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1101"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1401"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("31105-4820"), 2.5),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("31105-4821"), 2.5));
        //  return ResponseEntity.status(OK).body(courseHistoryService.saveHistory(transferCreditService.getTransferableCourse(mockData)));
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(mockData));

    }

    @GetMapping("/testexportExcel")
    public void testExportExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=credit-transfer.xlsx";
        response.setHeader(headerKey, headerValue);
//        List<TransferCreditRequest> mockData = List.of(
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30001-1055"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-2003"), 2),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2004"), 3),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1101"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 2),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1201"), 2),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1207"), 4));
        List<TransferCreditRequest> mockData = new ArrayList<>();
        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        transferCreditService.exportExcel(response, transferCreditService.getReport(mockResponseList));

    }

    @GetMapping("/exportExcel")
    public void exportExcel(HttpServletResponse response, @RequestBody List<TransferCreditRequest> transferCreditRequestList) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=credit-transfer.xlsx";
        response.setHeader(headerKey, headerValue);
        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(transferCreditRequestList);
        transferCreditService.exportExcel(response, transferCreditService.getReport(mockResponseList));
    }

    @GetMapping("/transfer-check")
    public ResponseEntity<List<TransferCreditResponse>> testTransferCheck(@RequestBody List<TransferCreditResponse> responseList) {
        List<TransferCreditRequest> transferCreditRequestList = transferCreditService.mapToTransferCreditRequestByTCRList(responseList);
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(transferCreditRequestList));
    }

//    @GetMapping("/getT")
//    public void testG(HttpServletResponse response) {
//        List<TransferCreditRequest> mockData = List.of(
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30001-1055"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-2003"), 2),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2004"), 3),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1101"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 2),
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1401"), 4));
//
//        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
//
//        try {
//            response.setContentType("application/pdf");
//
//            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transfer_credit.pdf\"");
//
//            pdfGeneratorService.createPdf(mockResponseList, response.getOutputStream());
//
//            response.getOutputStream().flush();
//        } catch (IOException e) {
//            throw new RuntimeException("Error occurred while generating PDF", e);
//        }
//    }
    @GetMapping("/spa")
    public ResponseEntity<ReportCourseResponse> testR() {
        List<TransferCreditRequest> mockData = List.of(
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30001-1055"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-2003"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2004"), 3),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1101"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1201"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1207"), 4));

        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        return ResponseEntity.status(OK).body(transferCreditService.getReport(mockResponseList));

    }

    @PostMapping("/sort")
    public ResponseEntity<List<TransferCreditResponse>> sortData(@RequestBody List<TransferCreditResponse> responseList,@RequestParam("key") String key, boolean ascending ) {
        return ResponseEntity.status(OK).body(transferCreditService.sortData(responseList, key, ascending));
    }
}
