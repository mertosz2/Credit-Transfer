package com.example.credittransfer.controller;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.DipCourseIdResponse;
import com.example.credittransfer.dto.response.ReportCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.exception.FileEmptyException;
import com.example.credittransfer.exception.FileExtensionNotMatchException;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import com.example.credittransfer.service.CourseHistoryService;
import com.example.credittransfer.service.OCRService;
import com.example.credittransfer.service.PDFGeneratorService;
import com.example.credittransfer.service.TransferCreditService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.io.input.ObservableInputStream;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/transfer")
public class TransferCreditController {

    private final TransferCreditService transferCreditService;
    private final OCRService ocrService;
    private final CourseHistoryService courseHistoryService;
    private final DiplomaCourseRepository diplomaCourseRepository;
    private final PDFGeneratorService pdfGeneratorService;
    private final UniversityCourseRepository universityCourseRepository;

    public TransferCreditController(TransferCreditService transferCreditService, OCRService ocrService, CourseHistoryService courseHistoryService, DiplomaCourseRepository diplomaCourseRepository, PDFGeneratorService pdfGeneratorService, UniversityCourseRepository universityCourseRepository) {
        this.transferCreditService = transferCreditService;
        this.ocrService = ocrService;
        this.courseHistoryService = courseHistoryService;
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.pdfGeneratorService = pdfGeneratorService;
        this.universityCourseRepository = universityCourseRepository;
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
        List<TransferCreditRequest> transferCreditRequestList = ocrService.getCourse(file);
        List<String> allIdFound = dipCourseIdResponse.getFoundedDipCourseIdList();
        List<String> inListOfRequest = transferCreditRequestList.stream().map(request -> request.getDiplomaCourse().getDipCourseId()).toList();
        System.out.println(allIdFound);
        List<String> dipCourseIdList = new ArrayList<>();
        if (!Objects.isNull(allIdFound) && !inListOfRequest.isEmpty()) {
            dipCourseIdList = allIdFound.stream().filter(dipCourseId -> !inListOfRequest.contains(dipCourseId)).toList();
            if(!dipCourseIdList.isEmpty()) {
                transferCreditRequestList.addAll(transferCreditService.mapToTransferCreditRequest(dipCourseIdList));
            }

        }
        file.delete();
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

    @PostMapping("/exportExcel")
    public void exportExcel(HttpServletResponse response, @RequestBody List<TransferCreditResponse> transferCreditResponseList) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=credit-transfer.xlsx";
        response.setHeader(headerKey, headerValue);
        transferCreditService.exportExcel(response, transferCreditService.getReport(transferCreditResponseList));
    }

    @GetMapping("/transfer-check")
    public ResponseEntity<List<TransferCreditResponse>> testTransferCheck(@RequestBody List<TransferCreditResponse> responseList) {
        List<TransferCreditRequest> transferCreditRequestList = transferCreditService.mapToTransferCreditRequestByTCRList(responseList);
        return ResponseEntity.status(OK).body(transferCreditService.getTransferableCourse(transferCreditRequestList));
    }

    @GetMapping("/spa")
    public ResponseEntity<ReportCourseResponse> testR() {
        List<TransferCreditRequest> mockData = List.of(
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1201"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30001-1055"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2004"), 3),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30204-2001"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-2003"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1401"), 2),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1101"), 4),
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1207"), 4));

        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        return ResponseEntity.status(OK).body(transferCreditService.getReport(mockResponseList));

    }

    @PostMapping("/report")
    public ResponseEntity<ReportCourseResponse> getReport(@RequestBody List<TransferCreditResponse> responseList) {
        return ResponseEntity.status(OK).body(transferCreditService.getReport(responseList));
    }

    @PostMapping("/sort")
    public ResponseEntity<List<TransferCreditResponse>> sortData(@RequestBody List<TransferCreditResponse> responseList,@RequestParam("key") String key, @RequestParam("direction") boolean ascending ) {
        return ResponseEntity.status(OK).body(transferCreditService.sortData(responseList, key, ascending));
    }

    @GetMapping("/oc2")
    public String tssa() throws IOException {
        return ocrService.getCourseId3();
    }
    @GetMapping("/oc3")
    public String tsaa() throws IOException {
        return ocrService.getCourseId2();
    }
    @GetMapping("/za")
    public ResponseEntity<List<TransferCreditResponse>> testRss() {
        List<TransferCreditRequest> mockData = List.of(
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1201"), 1),//071
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),//073
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 4),//073
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-1207"), 4));//072
//        new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9205"), 4),//073
//                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-9201"), 1));//073
                new TransferCreditRequest(diplomaCourseRepository.findByDipCourseId("30000-7801"), 4));//073

        List<TransferCreditResponse> mockResponseList = transferCreditService.getTransferableCourse(mockData);
        List<TransferCreditResponse> firstSection = new ArrayList<>(mockResponseList.stream()
                .filter(transferCreditResponse ->
                        Objects.equals(universityCourseRepository.findByUId(transferCreditResponse.getUniversityCourse().getUniId()).getCourseCategory().getCourseCategoryCode(), "11100"))
                .toList());
        return ResponseEntity.status(OK).body(transferCreditService.checkPreSubject(firstSection));

    }
}
