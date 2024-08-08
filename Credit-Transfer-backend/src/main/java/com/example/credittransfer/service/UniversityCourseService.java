package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.exception.ExistByCourseIdException;
import com.example.credittransfer.exception.ExistByCourseNameException;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.UniversityCourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UniversityCourseService {

    private final UniversityCourseRepository universityCourseRepository;

    public UniversityCourseService(UniversityCourseRepository universityCourseRepository) {
        this.universityCourseRepository = universityCourseRepository;
    }

    public List<UniversityCourse> findAll() {
        return universityCourseRepository.findAll();
    }

    @Transactional
    public ResponseAPI createCourse(UniversityCourseRequest request) {
        if(universityCourseRepository.existsByUniCourseId(request.getUniCourseId()))
        {
            throw new ExistByCourseIdException(request.getUniCourseId());
        }
        if(universityCourseRepository.existsByUniCourseName(request.getUniCourseName()))
        {
            throw new ExistByCourseNameException(request.getUniCourseName());
        }
        UniversityCourse universityCourse = new UniversityCourse();
        universityCourse.setUniCourseId(request.getUniCourseId());
        universityCourse.setUniCourseName(request.getUniCourseName());
        universityCourse.setUniCredit(request.getUniCredit());
        universityCourse.setActive(true);
        universityCourseRepository.save(universityCourse);
        return new ResponseAPI(HttpStatus.CREATED, "create course successfully");
    }

    @Transactional
    public ResponseAPI updateCourse(UniversityCourseRequest request, Integer uniId) {

        UniversityCourse universityCourse = universityCourseRepository.findById(uniId).orElseThrow();
        if(universityCourseRepository.existsByUniCourseId(request.getUniCourseId())
                && !Objects.equals(universityCourse.getUniCourseId(), request.getUniCourseId()))
        {
            throw new ExistByCourseIdException(request.getUniCourseId());
        }
        if(universityCourseRepository.existsByUniCourseName(request.getUniCourseName())
                && !Objects.equals(universityCourse.getUniCourseName(), request.getUniCourseName()))
        {
            throw new ExistByCourseNameException(request.getUniCourseName());
        }
        universityCourse.setUniCourseId(request.getUniCourseId());
        universityCourse.setUniCourseName(request.getUniCourseName());
        universityCourse.setUniCredit(request.getUniCredit());
        universityCourseRepository.save(universityCourse);
        return new ResponseAPI(HttpStatus.OK, "update course successfully");
    }

    @Transactional
    public ResponseAPI deleteUniCourse(Integer uniId) {
        Optional<UniversityCourse> universityCourse = universityCourseRepository.findByUniId(uniId);
        if(universityCourse.isPresent()){
            universityCourseRepository.deleteByUniId(universityCourse.get().getUniId());
            return new ResponseAPI(HttpStatus.OK, "delete course successfully");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "course not found with given id: " + uniId);
        }
    }

    public UniversityCourse findByUniId(Integer uniId) {
        return universityCourseRepository.findByUniId(uniId).orElseThrow(NoClassDefFoundError::new);
    }

    public UniversityCourse findByUniCourseId(String uniCourseId) {
        return universityCourseRepository.findByUniCourseId(uniCourseId).orElseThrow(NoClassDefFoundError::new);
    }

    public List<DropDown> getUniCourseDropdown() {
        return universityCourseRepository.getUniversityCoursesDropDown();
    }
}
