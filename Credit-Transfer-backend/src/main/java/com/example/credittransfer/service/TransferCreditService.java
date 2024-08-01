package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.DipCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TransferCreditService {

    private final DiplomaCourseRepository diplomaCourseRepository;
    private final UniversityCourseRepository universityCourseRepository;

    public TransferCreditService(DiplomaCourseRepository diplomaCourseRepository, UniversityCourseRepository universityCourseRepository) {
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.universityCourseRepository = universityCourseRepository;
    }

    public List<TransferCreditResponse> getTransferableCourse(List<TransferCreditRequest> transferCreditRequestList) {
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();

        // Map เพื่อเก็บรายการที่มี reference to the same UniversityCourse
        Map<Integer, List<TransferCreditRequest>> courseMap = new HashMap<>();

        // Iterate through each TransferCreditRequest
        for (TransferCreditRequest request : transferCreditRequestList) {
            DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(request.getDipCourseId());
            Integer uniCourseId = diplomaCourse.getUniversityCourse().getId();

            // Add the request to the map based on the uniCourseId
            courseMap.computeIfAbsent(uniCourseId, k -> new ArrayList<>()).add(request);
        }

        // แยก List ออกมาเป็นสอง list
        List<TransferCreditRequest> duplicatedRequests = new ArrayList<>();
        List<TransferCreditRequest> uniqueRequests = new ArrayList<>();

        for (Map.Entry<Integer, List<TransferCreditRequest>> entry : courseMap.entrySet()) {
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


        return transferCreditResponseList;
    }

    private TransferCreditResponse processRequest(TransferCreditRequest request) {
        List<DipCourseResponse> diplomaCourseList = new ArrayList<>();
        TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
        DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(request.getDipCourseId());
        diplomaCourseList.add(mapToDipCourseResponse(diplomaCourse, request.getDipGrade()));

        if (diplomaCourse.getDipCredit() < diplomaCourse.getUniversityCourse().getUniCredit() || request.getDipGrade() < 2) {
            transferCreditResponse.setTransferable(false);
        } else {
            transferCreditResponse.setTransferable(true);
        }

        transferCreditResponse.setDiplomaCourseList(diplomaCourseList);
        transferCreditResponse.setUniCourseId(diplomaCourse.getUniversityCourse().getUniCourseId());
        transferCreditResponse.setUniCourseName(diplomaCourse.getUniversityCourse().getUniCourseName());
        transferCreditResponse.setUniCredit(diplomaCourse.getUniversityCourse().getUniCredit());

        return transferCreditResponse;
    }

    private List<TransferCreditResponse> processDuplicateRequest(List<TransferCreditRequest> transferCreditRequestList) {
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();

        // Map เพื่อเก็บรายการที่มี reference to the same UniversityCourse
        Map<Integer, List<TransferCreditRequest>> courseMap = new HashMap<>();

        for (TransferCreditRequest request : transferCreditRequestList) {
            DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(request.getDipCourseId());
            int uniCourseId = diplomaCourse.getUniversityCourse().getId();

            // Add the request to the map based on the uniCourseId
            courseMap.computeIfAbsent(uniCourseId, k -> new ArrayList<>()).add(request);
        }

        // Process each group of TransferCreditRequest with the same UniversityCourse id
        for (Map.Entry<Integer, List<TransferCreditRequest>> entry : courseMap.entrySet()) {

            List<TransferCreditRequest> requests = entry.getValue();
            List<DipCourseResponse> diplomaCourseList = new ArrayList<>();
            int totalDipCredit = 0;
            boolean transferable = true;
            String uniCourseId = "";
            String uniCourseName = "";
            int uniCredit = 0;

            for (TransferCreditRequest request : requests) {
                DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(request.getDipCourseId());
                diplomaCourseList.add(mapToDipCourseResponse(diplomaCourse, request.getDipGrade()));
                if (request.getDipGrade() >= 2) {
                    totalDipCredit += diplomaCourse.getDipCredit();
                }
                uniCourseId = diplomaCourse.getUniversityCourse().getUniCourseId();
                uniCourseName = diplomaCourse.getUniversityCourse().getUniCourseName();
                uniCredit = diplomaCourse.getUniversityCourse().getUniCredit();
            }

            // Set transferable based on the totalDipCredit and uniCredit
            if (totalDipCredit < uniCredit) {
                transferable = false;
            }

            TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
            transferCreditResponse.setDiplomaCourseList(diplomaCourseList);
            transferCreditResponse.setUniCourseId(uniCourseId);
            transferCreditResponse.setUniCourseName(uniCourseName);
            transferCreditResponse.setUniCredit(uniCredit);
            transferCreditResponse.setTransferable(transferable);
            transferCreditResponseList.add(transferCreditResponse);
        }

        return transferCreditResponseList;
    }

    public List<TransferCreditRequest> mapToTransferCreditRequest(List<String> dipCourseId){
        List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
        for (String dipCourseIdStr : dipCourseId) {
            TransferCreditRequest transferCreditRequest = new TransferCreditRequest();
            transferCreditRequest.setDipCourseId(dipCourseIdStr);
            transferCreditRequestList.add(transferCreditRequest);
        }
        return transferCreditRequestList;
    }

    public DipCourseResponse mapToDipCourseResponse(DiplomaCourse diplomaCourse, double grade) {
        return DipCourseResponse.builder()
                .id(diplomaCourse.getId())
                .dipCourseId(diplomaCourse.getDipCourseId())
                .dipCourseName(diplomaCourse.getDipCourseName())
                .dipCredit(diplomaCourse.getDipCredit())
                .grade(grade)
                .build();
    }

    public List<TransferCreditResponse> validateTransferableResponse(List<TransferCreditResponse> transferCreditResponseList) {
        return transferCreditResponseList.stream()
                .filter(TransferCreditResponse::isTransferable)
                .toList();
    }

    public List<TransferCreditResponse> getAllTransferCourse() {
        List<String> dipCourseIdList = diplomaCourseRepository.findAll().stream().map(DiplomaCourse::getDipCourseId).toList();
        List<TransferCreditRequest> requestList = mapToTransferCreditRequest(dipCourseIdList);
        return getTransferableCourse(requestList);

    }
}
