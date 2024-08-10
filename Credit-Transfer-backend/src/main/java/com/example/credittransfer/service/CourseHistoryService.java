package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.TransferCreditRequest;
import com.example.credittransfer.dto.response.*;
import com.example.credittransfer.entity.*;
import com.example.credittransfer.repository.CourseHistoryDetailRepository;
import com.example.credittransfer.repository.CourseHistoryRepository;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.utility.Utility;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseHistoryService {

    private final CourseHistoryRepository courseHistoryRepository;
    private final CourseHistoryDetailRepository creditHistoryDetailRepository;
    private final DiplomaCourseRepository diplomaCourseRepository;
    private final TransferCreditService transferCreditService;



    private final CourseHistoryDetailRepository courseHistoryDetailRepository;

    public CourseHistoryService(CourseHistoryRepository courseHistoryRepository, CourseHistoryDetailRepository creditHistoryDetailRepository, DiplomaCourseRepository diplomaCourseRepository, TransferCreditService transferCreditService, CourseHistoryDetailRepository courseHistoryDetailRepository) {
        this.courseHistoryRepository = courseHistoryRepository;
        this.creditHistoryDetailRepository = creditHistoryDetailRepository;
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.transferCreditService = transferCreditService;
        this.courseHistoryDetailRepository = courseHistoryDetailRepository;
    }

    public ResponseAPI saveHistory(List<TransferCreditResponse> transferCreditResponseList) {
        CourseHistory courseHistory = new CourseHistory();
        List<CourseHistoryDetail> courseHistoryDetailList = new ArrayList<>();
        courseHistory.setTimestamp(LocalDateTime.now());
        courseHistory.setUsers(Utility.getUserPrincipal());
        for (TransferCreditResponse response : transferCreditResponseList) {
            for (DipCourseResponse dipCourseResponse : response.getDiplomaCourseList()) {
                CourseHistoryDetail courseHistoryDetail = new CourseHistoryDetail();
                courseHistoryDetail.setCourseHistory(courseHistory);
                courseHistoryDetail.setDiplomaCourse(diplomaCourseRepository.findByDipId(dipCourseResponse.getId()).orElseThrow());
                courseHistoryDetail.setDipGrade(dipCourseResponse.getGrade());
                courseHistoryDetailList.add(courseHistoryDetail);
            }
        }
        courseHistoryRepository.save(courseHistory);
        courseHistoryDetailRepository.saveAll(courseHistoryDetailList);

        return new ResponseAPI(HttpStatus.CREATED, "create successfully");
    }

    public List<CourseHistoryResponse> getAllHistory() {
        List<CourseHistoryResponse> courseHistoryResponseList = new ArrayList<>();
        List<CourseHistory> courseHistoryList = courseHistoryRepository.findByUsersId(Utility.getUserPrincipal().getUsersId());
        for (CourseHistory courseHistory : courseHistoryList) {

            List<CourseHistoryDetail> courseHistoryDetailList = courseHistoryDetailRepository.findByChId(courseHistory.getChId());
            List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
            for (CourseHistoryDetail courseHistoryDetail : courseHistoryDetailList) {
                TransferCreditRequest transferCreditRequest = transferCreditService
                        .mapToTransferCreditRequest(courseHistoryDetail.getDiplomaCourse(),courseHistoryDetail.getDipGrade());
                transferCreditRequestList.add(transferCreditRequest);
            }
            List<TransferCreditResponse> transferCreditResponseList = transferCreditService.getTransferableCourse(transferCreditRequestList);
            CourseHistoryResponse courseHistoryResponse = new CourseHistoryResponse();
            courseHistoryResponse.setChId(courseHistory.getChId());
            courseHistoryResponse.setTransferCreditResponseList(transferCreditResponseList);
            courseHistoryResponseList.add(courseHistoryResponse);
        }
        return courseHistoryResponseList;
    }

    public ResponseAPI deleteHistoryByChId(Integer chId) {
        Optional<CourseHistory> courseHistory = courseHistoryRepository.findById(chId);
        if(courseHistory.isPresent()) {
            courseHistoryRepository.deleteById(chId);
            return new ResponseAPI(HttpStatus.OK, "delete successfully");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "course history not found");
        }
    }

    public List<TransferCreditResponse> getHistoryByChId(Integer chId) {
        Optional<CourseHistory> courseHistoryOptional = courseHistoryRepository.findById(chId);
        List<TransferCreditResponse> transferCreditResponseList = new ArrayList<>();
        if(courseHistoryOptional.isPresent()) {
            CourseHistory courseHistory = courseHistoryOptional.get();
                List<CourseHistoryDetail> courseHistoryDetailList = courseHistoryDetailRepository.findByChId(courseHistory.getChId());
                List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
                for (CourseHistoryDetail courseHistoryDetail : courseHistoryDetailList) {
                    TransferCreditRequest transferCreditRequest = transferCreditService
                            .mapToTransferCreditRequest(courseHistoryDetail.getDiplomaCourse(),courseHistoryDetail.getDipGrade());
                    transferCreditRequestList.add(transferCreditRequest);
                }
                 transferCreditResponseList = transferCreditService.getTransferableCourse(transferCreditRequestList);
        }
        return transferCreditResponseList;
    }

    public ResponseAPI updateCourseHistory(List<TransferCreditResponse> transferCreditResponseList, Integer chId) {
        Optional<CourseHistory> courseHistoryOptional = courseHistoryRepository.findById(chId);
        if(courseHistoryOptional.isPresent()) {
            CourseHistory courseHistory = courseHistoryOptional.get();
            courseHistoryDetailRepository.deleteByChId(courseHistory.getChId());
            List<CourseHistoryDetail> courseHistoryDetailList = new ArrayList<>();
            courseHistory.setTimestamp(LocalDateTime.now());
            courseHistory.setUsers(Utility.getUserPrincipal());
            for (TransferCreditResponse response : transferCreditResponseList) {
                for (DipCourseResponse dipCourseResponse : response.getDiplomaCourseList()) {
                    CourseHistoryDetail courseHistoryDetail = new CourseHistoryDetail();
                    courseHistoryDetail.setCourseHistory(courseHistory);
                    courseHistoryDetail.setDiplomaCourse(diplomaCourseRepository.findByDipId(dipCourseResponse.getId()).orElseThrow());
                    courseHistoryDetail.setDipGrade(dipCourseResponse.getGrade());
                    courseHistoryDetailList.add(courseHistoryDetail);
                }
            }
            courseHistoryRepository.save(courseHistory);
            courseHistoryDetailRepository.saveAll(courseHistoryDetailList);

            return new ResponseAPI(HttpStatus.OK, "update successfully");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "course history not found");
        }

    }
}
