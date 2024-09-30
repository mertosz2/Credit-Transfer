package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.UniCourseResponse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.exception.ExistByCourseIdException;
import com.example.credittransfer.exception.ExistByCourseNameException;
import com.example.credittransfer.projection.DropDown;
import com.example.credittransfer.repository.CourseCategoryRepository;
import com.example.credittransfer.repository.UniversityCourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.PagedModel.PageMetadata;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UniversityCourseService {

    private final UniversityCourseRepository universityCourseRepository;
    private final CourseCategoryRepository courseCategoryRepository;

    public UniversityCourseService(UniversityCourseRepository universityCourseRepository, CourseCategoryRepository courseCategoryRepository) {
        this.universityCourseRepository = universityCourseRepository;
        this.courseCategoryRepository = courseCategoryRepository;
    }

    public PagedModel<UniCourseResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UniversityCourse> uniCoursePage = universityCourseRepository.findAll(pageable);

        List<UniCourseResponse> uniCourseResponseList = uniCoursePage.getContent()
                .stream().map(this::mapToUniCourseResponse).toList();

        PageMetadata pageMetadata = new PageMetadata(size, page, uniCoursePage.getTotalElements(), uniCoursePage.getTotalPages());
        PagedModel<UniCourseResponse> pagedModel = PagedModel.of(uniCourseResponseList, pageMetadata);

        return pagedModel;
    }

    @Transactional
    public ResponseAPI createCourse(UniversityCourseRequest request) {

        if (universityCourseRepository.existsByUniCourseId(request.getUniCourseId())) {
            throw new ExistByCourseIdException(request.getUniCourseId());
        }
        if (universityCourseRepository.existsByUniCourseName(request.getUniCourseName())) {
            throw new ExistByCourseNameException(request.getUniCourseName());
        }

        UniversityCourse universityCourse = new UniversityCourse();
        universityCourse.setUniCourseId(request.getUniCourseId());
        universityCourse.setUniCourseName(request.getUniCourseName());
        universityCourse.setUniCredit(request.getUniCredit());
        if (!Objects.equals(request.getPreSubject(), "-")) {
            UniversityCourse preSubject = universityCourseRepository.findByUId(Integer.valueOf(request.getPreSubject()));
            universityCourse.setPreSubject(preSubject.getPreSubject());
        } else {
            universityCourse.setPreSubject(request.getPreSubject());
        }
        universityCourse.setCourseCategory(courseCategoryRepository.findById(request.getCourseCategory()).orElseThrow());
        universityCourse.setActive(true);
        universityCourseRepository.save(universityCourse);
        return new ResponseAPI(HttpStatus.CREATED, "สร้างวิชาสำเร็จ");
    }

    @Transactional
    public ResponseAPI updateCourse(UniversityCourseRequest request, Integer uniId) {

        UniversityCourse universityCourse = universityCourseRepository.findById(uniId).orElseThrow();
        if (universityCourseRepository.existsByUniCourseId(request.getUniCourseId())
                && !Objects.equals(universityCourse.getUniCourseId(), request.getUniCourseId())) {
            throw new ExistByCourseIdException(request.getUniCourseId());
        }
        if (universityCourseRepository.existsByUniCourseName(request.getUniCourseName())
                && !Objects.equals(universityCourse.getUniCourseName(), request.getUniCourseName())) {
            throw new ExistByCourseNameException(request.getUniCourseName());
        }
        if (!Objects.equals(request.getPreSubject(), "-")) {
            UniversityCourse preSubject = universityCourseRepository.findByUId(Integer.valueOf(request.getPreSubject()));
            universityCourse.setPreSubject(preSubject.getPreSubject());
        } else {
            universityCourse.setPreSubject(request.getPreSubject());
        }
        universityCourse.setCourseCategory(courseCategoryRepository.findById(request.getCourseCategory()).orElseThrow());
        universityCourse.setUniCourseId(request.getUniCourseId());
        universityCourse.setUniCourseName(request.getUniCourseName());
        universityCourse.setUniCredit(request.getUniCredit());
        universityCourseRepository.save(universityCourse);
        return new ResponseAPI(HttpStatus.OK, "อัพเดทวิชาสำเร็จ");
    }

    @Transactional
    public ResponseAPI deleteUniCourse(Integer uniId) {
        Optional<UniversityCourse> universityCourse = universityCourseRepository.findByUniId(uniId);
        if (universityCourse.isPresent()) {
            universityCourseRepository.deleteByUniId(universityCourse.get().getUniId());
            return new ResponseAPI(HttpStatus.OK, "ลบวิชาสำเร็จ");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "ไม่พบรหัสวิชาดังกล่าว: " + uniId);
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

    public UniCourseResponse mapToUniCourseResponse(UniversityCourse universityCourse) {
        UniCourseResponse response = new UniCourseResponse();
        if (!Objects.isNull(universityCourse)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd-HH:mm:ss");
            response.setUniId(universityCourse.getUniId());
            response.setUniCourseId(universityCourse.getUniCourseId());
            response.setUniCourseName(universityCourse.getUniCourseName());
            response.setUniCredit(universityCourse.getUniCredit());
            response.setPreSubject(universityCourse.getPreSubject());
            response.setCourseCategory(universityCourse.getCourseCategory().getCourseCategoryCode());
            response.setCreatedBy(universityCourse.getCreatedBy().getFirstName() + " " + universityCourse.getCreatedBy().getLastName());
            response.setCreatedDate(universityCourse.getCreatedDate().format(formatter));
            response.setLastModifiedBy(universityCourse.getLastModifiedBy().getFirstName() + " " + universityCourse.getLastModifiedBy().getLastName());
            response.setLastModifiedDate(universityCourse.getLastModifiedDate().format(formatter));
        }
        return response;
    }

    public List<DropDown> getCourseCategoryDropdown() {
        return courseCategoryRepository.getCourseCategoryDropdown();
    }
}
