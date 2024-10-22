package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.UniversityCourseRequest;
import com.example.credittransfer.dto.response.DiplomaCourseResponse;
import com.example.credittransfer.dto.response.ResponseAPI;
import com.example.credittransfer.dto.response.UniCourseResponse;
import com.example.credittransfer.entity.CourseCategory;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.exception.ExistByCourseIdException;
import com.example.credittransfer.exception.ExistByCourseNameException;
import com.example.credittransfer.exception.NotFoundUniversityCourseException;
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
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Page<UniversityCourse> uniCoursePage = universityCourseRepository.findAllUniCourse(pageable);

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
            UniversityCourse preSubject = universityCourseRepository.findByUniCourseId((request.getPreSubject())).orElseThrow();
            universityCourse.setPreSubject(preSubject.getUniCourseId());
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
        UniversityCourse universityCourse = universityCourseRepository.findById(uniId).orElseThrow(() -> new NotFoundUniversityCourseException("uniId " + uniId.toString()));

        if (universityCourseRepository.existsByUniCourseId(request.getUniCourseId())
                && !Objects.equals(universityCourse.getUniCourseId(), request.getUniCourseId())) {
            throw new ExistByCourseIdException(request.getUniCourseId());
        }

        if (universityCourseRepository.existsByUniCourseName(request.getUniCourseName())
                && !Objects.equals(universityCourse.getUniCourseName(), request.getUniCourseName())) {
            throw new ExistByCourseNameException(request.getUniCourseName());
        }

        if (!Objects.equals(request.getPreSubject(), "-")) {
            Optional<UniversityCourse> preSubjectOpt = universityCourseRepository.findByUniCourseId(request.getPreSubject());
            if (!preSubjectOpt.isPresent()) {
                throw new NotFoundUniversityCourseException("presubject " + request.getPreSubject());
            }
            UniversityCourse preSubject = preSubjectOpt.get();
            universityCourse.setPreSubject(preSubject.getUniCourseId());
        } else {
            universityCourse.setPreSubject(request.getPreSubject());
        }

        Optional<CourseCategory> courseCategoryOpt = courseCategoryRepository.findById(request.getCourseCategory());
        if (courseCategoryOpt.isEmpty()) {
            System.out.println("cc id = " + request.getCourseCategory());
            throw new NotFoundUniversityCourseException(String.valueOf("cc id = " + request.getCourseCategory())); // หรือสร้าง exception ที่เหมาะสม
        }
        CourseCategory courseCategory = courseCategoryOpt.get();
        universityCourse.setCourseCategory(courseCategory);

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

    public List<DropDown> getCreateUniCourseDropdown() {
        return universityCourseRepository.getUniversityCoursesDropDown();
    }
    public List<DropDown> getEditUniCourseDropdown() {
        List<DropDown> uniDropdown = universityCourseRepository.getUniversityCoursesDropDown();
        uniDropdown.addFirst(new DropDown() {
            @Override
            public int getId() {
                return 0;
            }

            @Override
            public String getValue() {
                return "-";
            }

            @Override
            public String getLabel() {
                return "-";
            }
        });
        return uniDropdown;
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

    public PagedModel<UniCourseResponse> sortData(PagedModel<UniCourseResponse> pagedModel, String key, boolean ascending) {
        List<UniCourseResponse> sortedList = pagedModel.getContent().stream()
                .sorted(getComparator(key, ascending))
                .collect(Collectors.toList());

        return PagedModel.of(sortedList, pagedModel.getMetadata());
    }

    private Comparator<UniCourseResponse> getComparator(String key, boolean ascending) {
        Comparator<UniCourseResponse> comparator;

        switch (key) {
            case "uniCourseId":
                comparator = Comparator.comparing(UniCourseResponse::getUniCourseId);
                break;
            case "uniCourseName":
                comparator = Comparator.comparing(UniCourseResponse::getUniCourseName);
                break;
            case "courseCategory":
                comparator = Comparator.comparing(UniCourseResponse::getCourseCategory);
                break;
            case "uniCredit":
                comparator = Comparator.comparing(UniCourseResponse::getUniCredit);
                break;
            case "preSubject":
                comparator = Comparator.comparing(UniCourseResponse::getPreSubject);
                break;
            default:
                throw new IllegalArgumentException("Invalid sorting key: " + key);
        }

        return ascending ? comparator : comparator.reversed();
    }

    public PagedModel<UniCourseResponse> searchCourse(int page, int size,
                                                      String uniCourseId,
                                                      String uniCourseName,
                                                      String courseCategory,
                                                      String courseCategoryName,
                                                      Integer uniCredit,
                                                      String preSubject) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UniversityCourse> uniCoursePage = universityCourseRepository.searchUniCourse(
                pageable, uniCourseId, uniCourseName, courseCategory, courseCategoryName, uniCredit, preSubject);

        List<UniCourseResponse> uniCourseResponseList = uniCoursePage.getContent()
                .stream().map(this::mapToUniCourseResponse).toList();

        PageMetadata pageMetadata = new PageMetadata(size, page, uniCoursePage.getTotalElements(), uniCoursePage.getTotalPages());
        PagedModel<UniCourseResponse> pagedModel = PagedModel.of(uniCourseResponseList, pageMetadata);

        return pagedModel;
    }
}
