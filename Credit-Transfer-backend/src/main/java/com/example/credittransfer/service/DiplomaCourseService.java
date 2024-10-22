package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.DiplomaCourseRequest;
import com.example.credittransfer.dto.response.*;
import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.exception.ExistByCourseIdException;
import com.example.credittransfer.exception.ExistByCourseNameException;
import com.example.credittransfer.exception.NotFoundDiplomaCourseException;
import com.example.credittransfer.exception.NotFoundUniversityCourseException;
import com.example.credittransfer.repository.DiplomaCourseRepository;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DiplomaCourseService {

    private final DiplomaCourseRepository diplomaCourseRepository;
    private final UniversityCourseRepository universityCourseRepository;
    private final TransferCreditService transferCreditService;

    public DiplomaCourseService(DiplomaCourseRepository diplomaCourseRepository, UniversityCourseRepository universityCourseRepository, TransferCreditService transferCreditService) {
        this.diplomaCourseRepository = diplomaCourseRepository;
        this.universityCourseRepository = universityCourseRepository;
        this.transferCreditService = transferCreditService;
    }

    public ResponseAPI createCourse(DiplomaCourseRequest request) {
        if (diplomaCourseRepository.existsByDipCourseId(request.getDipCourseId())) {
            throw new ExistByCourseIdException(request.getDipCourseId());
        }
        if (diplomaCourseRepository.existsByDipCourseName(request.getDipCourseName())) {
            throw new ExistByCourseNameException(request.getDipCourseName());
        }

        DiplomaCourse diplomaCourse = new DiplomaCourse();
        diplomaCourse.setDipCourseId(request.getDipCourseId());
        diplomaCourse.setDipCourseName(request.getDipCourseName());
        diplomaCourse.setDipCredit(request.getDipCredit());
        diplomaCourse.setUniversityCourse(universityCourseRepository.findByUniId(request.getUniId()).orElseThrow(
                () -> new NotFoundUniversityCourseException("uniId: " + request.getUniId())
        ));
        diplomaCourse.setActive(true);
        diplomaCourseRepository.save(diplomaCourse);
        return new ResponseAPI(HttpStatus.CREATED, "สร้างวิชาสำเร็จ");
    }

    public ResponseAPI updateCourse(DiplomaCourseRequest request, Integer dipCourseId) {

        DiplomaCourse diplomaCourse = diplomaCourseRepository.findById(dipCourseId).orElseThrow();
        if (diplomaCourseRepository.existsByDipCourseId(request.getDipCourseId())
                && !Objects.equals(diplomaCourse.getDipCourseId(), request.getDipCourseId())) {
            throw new ExistByCourseIdException(request.getDipCourseId());
        }
        if (diplomaCourseRepository.existsByDipCourseName(request.getDipCourseName())
                && !Objects.equals(diplomaCourse.getDipCourseName(), request.getDipCourseName())) {
            throw new ExistByCourseNameException(request.getDipCourseName());
        }
        diplomaCourse.setDipCourseId(request.getDipCourseId());
        diplomaCourse.setDipCourseName(request.getDipCourseName());
        diplomaCourse.setDipCredit(request.getDipCredit());
        diplomaCourse.setUniversityCourse(universityCourseRepository.findByUniId(request.getUniId()).orElseThrow(
                () -> new NotFoundUniversityCourseException("uniId: " + request.getUniId())
        ));
        diplomaCourseRepository.save(diplomaCourse);
        return new ResponseAPI(HttpStatus.OK, "อัพเดทวิชาสำเร็จ");
    }

    public List<DiplomaCourse> getByDipCourseIdList(List<String> dipCourseIdList) {
        return diplomaCourseRepository.findByDipCourseIdList(dipCourseIdList);

    }

    public PagedModel<DiplomaCourseResponse> getAllDipCourse(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DiplomaCourse> diplomaCoursesPage = diplomaCourseRepository.findAllDip(pageable);

        List<DiplomaCourseResponse> diplomaCourseResponses = diplomaCoursesPage.getContent().stream()
                .map(this::mapToDiplomaCourseResponse)
                .toList();

        PageMetadata pageMetadata = new PageMetadata(
                size, page, diplomaCoursesPage.getTotalElements(), diplomaCoursesPage.getTotalPages());

        PagedModel<DiplomaCourseResponse> pagedModel = PagedModel.of(diplomaCourseResponses, pageMetadata);
        return pagedModel;
    }

    public List<String> getExistDipCourseId(List<String> dipCourseIdList) {
        return dipCourseIdList.stream()
                .filter(dipCourseId -> !Objects.isNull(diplomaCourseRepository.findByDipCourseId(dipCourseId)))
                .toList();
    }

    public List<String> validateDipCourseId(List<String> dipCourseIdList) {
        return dipCourseIdList.stream()
                .filter(dipCourseId -> Objects.isNull(diplomaCourseRepository.findByDipCourseId(dipCourseId)))
                .toList();
    }

    @Transactional
    public ResponseAPI deleteDipCourse(Integer dipId) {
        Optional<DiplomaCourse> diplomaCourse = diplomaCourseRepository.findByDipId(dipId);
        if (diplomaCourse.isPresent()) {
            diplomaCourseRepository.deleteByDipId(diplomaCourse.get().getDipId());
            return new ResponseAPI(HttpStatus.OK, "ลบวิชาสำเร็จ");
        } else {
            return new ResponseAPI(HttpStatus.BAD_REQUEST, "ไม่พบรหัสวิชาดังกล่าว: " + dipId);
        }
    }

    public DiplomaCourse findByDipId(Integer dipId) {
        return diplomaCourseRepository.findByDipId(dipId).orElseThrow();
    }

    public TransferCreditResponse findByDipCourseId(String dipCourseId) {
        DiplomaCourse diplomaCourse = diplomaCourseRepository.findByDipCourseId(dipCourseId);
        if (Objects.isNull(diplomaCourse)) {
            throw new NotFoundDiplomaCourseException(dipCourseId);
        } else {
            List<DipCourseResponse> dipCourseResponseList = new ArrayList<>();
            dipCourseResponseList.add(transferCreditService.mapToDipCourseResponse(diplomaCourse, 0));

            TransferCreditResponse transferCreditResponse = new TransferCreditResponse();
            transferCreditResponse.setTransferable(false);
            transferCreditResponse.setDiplomaCourseList(dipCourseResponseList);
            transferCreditResponse.setUniversityCourse(diplomaCourse.getUniversityCourse());
            return transferCreditResponse;
        }
    }

    public DiplomaCourseResponse mapToDiplomaCourseResponse(DiplomaCourse diplomaCourse) {
        DiplomaCourseResponse response = new DiplomaCourseResponse();
        if (!Objects.isNull(diplomaCourse)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd-HH:mm:ss");
            response.setId(diplomaCourse.getDipId());
            response.setDipCourseId(diplomaCourse.getDipCourseId());
            response.setDipCourseName(diplomaCourse.getDipCourseName());
            response.setDipCredit(diplomaCourse.getDipCredit());
            response.setUniCourseId(diplomaCourse.getUniversityCourse().getUniCourseId());
            response.setUniCourseName(diplomaCourse.getUniversityCourse().getUniCourseName());
            response.setUniCredit(diplomaCourse.getUniversityCourse().getUniCredit());
            response.setCreatedBy(diplomaCourse.getCreatedBy().getFirstName() + " " + diplomaCourse.getCreatedBy().getLastName());
            response.setCreatedDate(diplomaCourse.getCreatedDate().format(formatter));
            response.setLastModifiedBy(diplomaCourse.getLastModifiedBy().getFirstName() + " " + diplomaCourse.getLastModifiedBy().getLastName());
            response.setLastModifiedDate(diplomaCourse.getLastModifiedDate().format(formatter));
        }
        return response;
    }

    public PagedModel<DiplomaCourseResponse> sortData(PagedModel<DiplomaCourseResponse> pagedModel, String key, boolean ascending) {
        List<DiplomaCourseResponse> sortedList = pagedModel.getContent().stream()
                .sorted(getComparator(key, ascending))
                .collect(Collectors.toList());

        return PagedModel.of(sortedList, pagedModel.getMetadata());
    }

    //sort item
    private Comparator<DiplomaCourseResponse> getComparator(String key, boolean ascending) {
        Comparator<DiplomaCourseResponse> comparator;

        switch (key) {
            case "dipCourseId":
                comparator = Comparator.comparing(DiplomaCourseResponse::getDipCourseId);
                break;
            case "dipCourseName":
                comparator = Comparator.comparing(DiplomaCourseResponse::getDipCourseName);
                break;
            case "dipCredit":
                comparator = Comparator.comparing(DiplomaCourseResponse::getDipCredit);
                break;
            case "uniCourseId":
                comparator = Comparator.comparing(DiplomaCourseResponse::getUniCourseId);
                break;
            case "uniCourseName":
                comparator = Comparator.comparing(DiplomaCourseResponse::getUniCourseName);
                break;
            case "uniCredit":
                comparator = Comparator.comparing(DiplomaCourseResponse::getUniCredit);
                break;
            default:
                throw new IllegalArgumentException("Invalid sorting key: " + key);
        }

        return ascending ? comparator : comparator.reversed();
    }

    public PagedModel<DiplomaCourseResponse> searchCourse(int page, int size,
                                                          String dipCourseId,
                                                          String dipCourseName,
                                                          String uniCourseId,
                                                          String uniCourseName,
                                                          Integer dipCredit) {

        Pageable pageable = PageRequest.of(page, size);
        Page<DiplomaCourse> diplomaCoursesPage = diplomaCourseRepository.searchUniCourse(
                pageable, dipCourseId, dipCourseName, uniCourseId, uniCourseName, dipCredit);

        List<DiplomaCourseResponse> diplomaCourseResponses = diplomaCoursesPage.getContent().stream()
                .map(this::mapToDiplomaCourseResponse)
                .toList();

        PageMetadata pageMetadata = new PageMetadata(
                size, page, diplomaCoursesPage.getTotalElements(), diplomaCoursesPage.getTotalPages());

        PagedModel<DiplomaCourseResponse> pagedModel = PagedModel.of(diplomaCourseResponses, pageMetadata);
        return pagedModel;

    }
}
