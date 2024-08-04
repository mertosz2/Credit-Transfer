package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.exception.ExistByCourseIdException;
import com.example.credittransfer.exception.ExistByCourseNameException;
import com.example.credittransfer.repository.DiplomaCourseRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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
        if(diplomaCourseRepository.existsByDipCourseId(request.getDipCourseId()))
        {
            throw new ExistByCourseIdException(request.getDipCourseId());
        }
        if(diplomaCourseRepository.existsByDipCourseName(request.getDipCourseName()))
        {
            throw new ExistByCourseNameException(request.getDipCourseName());
        }
        DiplomaCourse diplomaCourse = new DiplomaCourse();
        diplomaCourse.setDipCourseId(request.getDipCourseId());
        diplomaCourse.setDipCourseName(request.getDipCourseName());
        diplomaCourse.setDipCredit(request.getDipCredit());
        diplomaCourseRepository.save(diplomaCourse);
        return new ResponseAPI(HttpStatus.CREATED, "create successfully");
    }

    public ResponseAPI updateCourse(DiplomaCourseRequest request, Integer dipCourseId) {

        DiplomaCourse diplomaCourse = diplomaCourseRepository.findById(dipCourseId).orElseThrow();
        if(diplomaCourseRepository.existsByDipCourseId(request.getDipCourseId())
                && !Objects.equals(diplomaCourse.getDipCourseId(), request.getDipCourseId()))
        {
            throw new ExistByCourseIdException(request.getDipCourseId());
        }
        if(diplomaCourseRepository.existsByDipCourseName(request.getDipCourseName())
                && !Objects.equals(diplomaCourse.getDipCourseName(), request.getDipCourseName()))
        {
            throw new ExistByCourseNameException(request.getDipCourseName());
        }
        diplomaCourse.setDipCourseId(request.getDipCourseId());
        diplomaCourse.setDipCourseName(request.getDipCourseName());
        diplomaCourse.setDipCredit(request.getDipCredit());
        diplomaCourseRepository.save(diplomaCourse);
        return new ResponseAPI(HttpStatus.OK, "update successfully");
    }

    public List<DiplomaCourse> getByDipCourseIdList(List<String> dipCourseIdList) {
        return diplomaCourseRepository.findByDipCourseIdList(dipCourseIdList);

    }
    public List<DiplomaCourse> getAllDipCourse() {
        return diplomaCourseRepository.findAll();
    }

    public List<String> getExistDipCourseId(List<String> dipCourseIdList) {
        return dipCourseIdList.stream()
                .filter(dipCourseId -> !Objects.isNull(diplomaCourseRepository.findByDipCourseId(dipCourseId)))
                .toList();
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
