package com.example.credittransfer.repository;

import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityCourseRepository extends JpaRepository<UniversityCourse, Integer> {

//    @Query("select case when count(u) > 0 then true else false from UniversityCourse u where u.uniCourseId = :uniCourseId")
//    boolean existsByUniCourseId(Integer uniCourseId);

    @Query("select uc.uniId as id, uc.uniCourseId as value, concat(uc.uniCourseId,'-', uc.uniCourseName) as label from UniversityCourse uc where uc.isActive = true ")
    List<DropDown> getUniversityCoursesDropDown();

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseId = :UniCourseId and uc.isActive = true")
    boolean existsByUniCourseId(String UniCourseId);

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseName = :UniCourseName and uc.isActive = true")
    boolean existsByUniCourseName(String UniCourseName);

    @Query("update UniversityCourse uc set uc.isActive = false where uc.uniId = :uniId")
    @Modifying
    void deleteByUniId(Integer uniId);

    @Query("select uc from UniversityCourse uc where uc.uniId = :uniId and uc.isActive = true")
    Optional<UniversityCourse> findByUniId(Integer uniId);

    @Query("select uc from UniversityCourse uc where uc.uniCourseId = :uniCourseId and uc.isActive = true")
    Optional<UniversityCourse> findByUniCourseId(String uniCourseId);

    @Query("select uc from UniversityCourse uc where uc.uniId = :id and uc.isActive = true")
    UniversityCourse findByUId(Integer id);

    @Query("select uc from UniversityCourse  uc where uc.isActive = true")
    Page<UniversityCourse> findAllUniCourse(Pageable pageable);

    @Query("SELECT uc FROM UniversityCourse uc WHERE " +
            "(:uniCourseId IS NULL OR uc.uniCourseId LIKE %:uniCourseId%) AND " +
            "(:uniCourseName IS NULL OR uc.uniCourseName LIKE %:uniCourseName%) AND " +
            "(:courseCategory IS NULL OR uc.courseCategory.courseCategoryCode LIKE %:courseCategory%) AND " +
            "(:uniCredit IS NULL OR uc.uniCredit = :uniCredit) AND " +
            "(:preSubject IS NULL OR uc.preSubject = :preSubject) AND " +
            "uc.isActive = true")
    Page<UniversityCourse> searchUniCourse(Pageable pageable,
                                           @Param("uniCourseId") String uniCourseId,
                                           @Param("uniCourseName") String uniCourseName,
                                           @Param("courseCategory") String courseCategory,
                                           @Param("uniCredit") Integer uniCredit,
                                           @Param("preSubject") String preSubject);
}

