package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.DipCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class TransferCreditService {

    private final DiplomaCourseRepository diplomaCourseRepository;
    private final UniversityCourseRepository universityCourseRepository;
    private final ExportExcelService exportExcelService;


    public TransferCreditService(DiplomaCourseRepository diplomaCourseRepository, UniversityCourseRepository universityCourseRepository, ExportExcelService exportExcelService) {
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.universityCourseRepository = universityCourseRepository;
        this.exportExcelService = exportExcelService;
    }

    public List<TransferCreditResponse> getTransferableCourse(List<TransferCreditRequest> transferCreditRequestList) {
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();

        // Map เพื่อเก็บรายการที่มี reference to the same UniversityCourse
        Map<Integer, List<TransferCreditRequest>> sameUniCourseId = new HashMap<>();

        // Iterate through each TransferCreditRequest
        for (TransferCreditRequest request : transferCreditRequestList) {
            Integer uniCourseId = request.getDiplomaCourse().getUniversityCourse().getUniId();

            // Add the request to the map based on the uniCourseId
            sameUniCourseId.computeIfAbsent(uniCourseId, k -> new ArrayList<>()).add(request);
        }

        // แยก List ออกมาเป็นสอง list
        List<TransferCreditRequest> duplicatedRequests = new ArrayList<>();
        List<TransferCreditRequest> uniqueRequests = new ArrayList<>();

        for (Map.Entry<Integer, List<TransferCreditRequest>> entry : sameUniCourseId.entrySet()) {
            List<TransferCreditRequest> requests = entry.getValue();
            if (requests.size() > 1) {
                duplicatedRequests.addAll(requests);
            } else {
                uniqueRequests.addAll(requests);
            }
        }

        // Process the unique requests
        for (TransferCreditRequest request : uniqueRequests) {
            TransferCreditResponse transferCreditResponse = processRequest(request);
            transferCreditResponseList.add(transferCreditResponse);
        }

        // Process the duplicated requests
        transferCreditResponseList.addAll(processDuplicateRequest(duplicatedRequests));
        transferCreditResponseList.sort(Comparator.comparing(transferCreditResponse -> transferCreditResponse.getUniversityCourse().getUniCourseId()));

        return transferCreditResponseList;
    }

    private TransferCreditResponse processRequest(TransferCreditRequest request) {
        List<DipCourseResponse> diplomaCourseList = new ArrayList<>();
        TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
        DiplomaCourse diplomaCourse = request.getDiplomaCourse();
        diplomaCourseList.add(mapToDipCourseResponse(diplomaCourse, request.getDipGrade()));

        if (diplomaCourse.getDipCredit() < diplomaCourse.getUniversityCourse().getUniCredit() || request.getDipGrade() < 2) {
            transferCreditResponse.setTransferable(false);
        } else {
            transferCreditResponse.setTransferable(true);
        }

        transferCreditResponse.setDiplomaCourseList(diplomaCourseList);
        transferCreditResponse.setUniversityCourse(diplomaCourse.getUniversityCourse());

        return transferCreditResponse;
    }

    private List<TransferCreditResponse> processDuplicateRequest(List<TransferCreditRequest> transferCreditRequestList) {
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();

        // Map เพื่อเก็บรายการที่มี reference to the same UniversityCourse
        Map<Integer, List<TransferCreditRequest>> sameUniCourseId = new HashMap<>();

        for (TransferCreditRequest request : transferCreditRequestList) {
            DiplomaCourse diplomaCourse = request.getDiplomaCourse();
            int uniCourseId = diplomaCourse.getUniversityCourse().getUniId();

            // Add the request to the map based on the uniCourseId
            sameUniCourseId.computeIfAbsent(uniCourseId, k -> new ArrayList<>()).add(request);
        }

        // Process each group of TransferCreditRequest with the same UniversityCourse id
        for (Map.Entry<Integer, List<TransferCreditRequest>> entry : sameUniCourseId.entrySet()) {

            List<TransferCreditRequest> requests = entry.getValue();
            List<DipCourseResponse> diplomaCourseList = new ArrayList<>();
            int totalDipCredit = 0;
            boolean transferable = true;
            UniversityCourse universityCourse = new UniversityCourse();
            int uniCredit = 0;

            for (TransferCreditRequest request : requests) {
                DiplomaCourse diplomaCourse = request.getDiplomaCourse();
                diplomaCourseList.add(mapToDipCourseResponse(diplomaCourse, request.getDipGrade()));
                if (request.getDipGrade() >= 2) {
                    totalDipCredit += diplomaCourse.getDipCredit();
                }
                universityCourse = diplomaCourse.getUniversityCourse();
            }

            // Set transferable based on the totalDipCredit and uniCredit
            if (totalDipCredit < uniCredit) {
                transferable = false;
            }

            TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
            transferCreditResponse.setDiplomaCourseList(diplomaCourseList);
            transferCreditResponse.setUniversityCourse(universityCourse);
            transferCreditResponse.setTransferable(transferable);
            transferCreditResponseList.add(transferCreditResponse);
        }

        return transferCreditResponseList;
    }

    public List<TransferCreditRequest> mapToTransferCreditRequest(List<String> dipCourseId){
        List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
        for (String dipCourseIdStr : dipCourseId) {
            TransferCreditRequest transferCreditRequest = new TransferCreditRequest();
            DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(dipCourseIdStr);
            transferCreditRequest.setDiplomaCourse(diplomaCourse);
            transferCreditRequest.setDipGrade(0);
            transferCreditRequestList.add(transferCreditRequest);
        }
        return transferCreditRequestList;
    }

    public DipCourseResponse mapToDipCourseResponse(DiplomaCourse diplomaCourse, double grade) {
        return DipCourseResponse.builder()
                .id(diplomaCourse.getDipId())
                .dipCourseId(diplomaCourse.getDipCourseId())
                .dipCourseName(diplomaCourse.getDipCourseName())
                .dipCredit(diplomaCourse.getDipCredit())
                .grade(grade)
                .build();
    }

    public List<TransferCreditResponse> validateTransferableResponse(List<TransferCreditResponse> transferCreditResponseList) {
        List<TransferCreditResponse> responseList = new ArrayList<>(transferCreditResponseList.stream()
                .filter(TransferCreditResponse::isTransferable)
                .toList());
        responseList.sort(Comparator.comparing(transferCreditResponse -> transferCreditResponse.getUniversityCourse().getUniCourseId()));
        return responseList;
    }

    public List<TransferCreditResponse> getAllTransferCourse() {
        List<String> dipCourseIdList = diplomaCourseRepository.findAll().stream().map(DiplomaCourse::getDipCourseId).toList();
        List<TransferCreditRequest> requestList = mapToTransferCreditRequest(dipCourseIdList);
        return getTransferableCourse(requestList);

    }

    public void exportExcel(HttpServletResponse response, List<TransferCreditResponse> transferCreditResponseList) throws IOException {
        List<String> heaerList = List.of(
                "รหัสวิชา\nCourse Code",
                "วิชาที่ขอเทียบโอน\nCourse transferred from",
                "เกรด\nGrade",
                "หน่วยกิต\nCredit",
                "รหัสวิชา\nCourse Code",
                "วิชาที่เทียบโอนหน่วยกิตได้\nTransferred Course Equivalents",
                "หน่วยกิต\nCredit"
        );
        exportExcelService.exportDataToExcel(response,heaerList, validateTransferableResponse(transferCreditResponseList));
    }

    public TransferCreditRequest mapToTransferCreditRequest(DiplomaCourse diplomaCourse, double grade){
        TransferCreditRequest transferCreditRequest = new TransferCreditRequest();
        transferCreditRequest.setDiplomaCourse(diplomaCourse);
        transferCreditRequest.setDipGrade(grade);

        return transferCreditRequest;
    }

    public List<TransferCreditRequest> mapToTransferCreditRequestByTCRList(List<TransferCreditResponse> transferCreditResponseList) {
        List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
        for (TransferCreditResponse request : transferCreditResponseList) {
            for(DipCourseResponse dipCourseResponse :request.getDiplomaCourseList()) {
                TransferCreditRequest transferCreditRequest = new TransferCreditRequest();
                transferCreditRequest.setDiplomaCourse(diplomaCourseRepository.findById(dipCourseResponse.getId()).orElseThrow());
                transferCreditRequest.setDipGrade(dipCourseResponse.getGrade());
                transferCreditRequestList.add(transferCreditRequest);
            }
        }
        return  transferCreditRequestList;
    }
}
