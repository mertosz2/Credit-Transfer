package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransferCreditService {

    private final DiplomaCourseRepository diplomaCourseRepository;
    private final UniversityCourseRepository universityCourseRepository;

    public TransferCreditService(DiplomaCourseRepository diplomaCourseRepository, UniversityCourseRepository universityCourseRepository) {
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.universityCourseRepository = universityCourseRepository;
    }

    public List<TransferCreditResponse> getTransferableCourse(List<TransferCreditRequest> TransferCreditRequestList) {
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();
        for (TransferCreditRequest request : TransferCreditRequestList) {
            TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
            DiplomaCourse diplomaCourse = diplomaCourseRepository.findById(request.getDipId()).orElseThrow();

            if (diplomaCourse.getDipCredit() < diplomaCourse.getUniversityCourse().getUniCredit() && request.getDipGrade() < 2) {
                transferCreditResponse.setTransferable(false);
            } else {
                transferCreditResponse.setTransferable(true);

            }
            transferCreditResponse.setUniCourseId(diplomaCourse.getUniversityCourse().getUniCourseId());
            transferCreditResponse.setUniCourseName(diplomaCourse.getUniversityCourse().getUniCourseName());
            transferCreditResponse.setUniCredit(diplomaCourse.getUniversityCourse().getUniCredit());
            transferCreditResponseList.add(transferCreditResponse);
        }

        return transferCreditResponseList;

    }


}
