package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.repository.UniversityCourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UniversityCourseService {

    private final UniversityCourseRepository universityCourseRepository;

    public UniversityCourseService(UniversityCourseRepository universityCourseRepository) {
        this.universityCourseRepository = universityCourseRepository;
    }

    public List<UniversityCourse> findAll() {
        return universityCourseRepository.findAll();
    }

    public ResponseAPI createCourse(UniversityCourseRequest request) {
        UniversityCourse universityCourse = new UniversityCourse();
        universityCourse.setUniCourseId(request.getUniCourseId());
        universityCourse.setUniCourseName(request.getUniCourseName());
        universityCourse.setUniCredit(request.getUniCredit());
        universityCourseRepository.save(universityCourse);
        return new ResponseAPI(HttpStatus.OK, "create course successfully");
    }
}
