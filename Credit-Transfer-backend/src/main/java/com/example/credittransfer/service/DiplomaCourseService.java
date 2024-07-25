package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class DiplomaCourseService {

    private final DiplomaCourseRepository diplomaCourseRepository;
    private final UniversityCourseRepository universityCourseRepository;

    public DiplomaCourseService(DiplomaCourseRepository diplomaCourseRepository, UniversityCourseRepository universityCourseRepository) {
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.universityCourseRepository = universityCourseRepository;
    }

    public ResponseAPI createCourse(DiplomaCourseRequest request) {
        DiplomaCourse diplomaCourse = new DiplomaCourse();
        diplomaCourse.setDipCourseId(request.getDipCourseId());
        diplomaCourse.setDipCourseName(request.getDipCourseName());
        diplomaCourse.setDipCredit(request.getDipCredit());
        diplomaCourseRepository.save(diplomaCourse);
        return new ResponseAPI(HttpStatus.OK, "create successfully");
    }

    public List<DiplomaCourse> getByDipCourseIdList(List<String> dipCourseIdList) {
        List<DiplomaCourse> diplomaCourseList = diplomaCourseRepository.findByDipCourseIdList(dipCourseIdList);
        return diplomaCourseList;

    }

    public String validateDipCourseId(List<String> dipCourseIdList) {
        List<String> notFoundDipCourseId = dipCourseIdList.stream()
                .filter(dipCourseId -> Objects.isNull(diplomaCourseRepository.findByDipCourseId(dipCourseId)))
                .toList();

        if (notFoundDipCourseId.isEmpty()) {
            return "success";
        }

        return "วิชาที่ยังไม่ลงทะเบียนกับระบบ : " + String.join(", ", notFoundDipCourseId);
    }
}
