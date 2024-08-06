package com.example.credittransfer.repository;

import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityCourseRepository extends JpaRepository<UniversityCourse, Integer> {

//    @Query("select case when count(u) > 0 then true else false from UniversityCourse u where u.uniCourseId = :uniCourseId")
//    boolean existsByUniCourseId(Integer uniCourseId);

    @Query("select uc.id as id, uc.uniCourseId as value, concat(uc.uniCourseId,' - ', uc.uniCourseName) as label from UniversityCourse uc where uc.isActive = true ")
    List<DropDown> getUniversityCoursesDropDown();

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseId = :UniCourseId and uc.isActive = true")
    boolean existsByUniCourseId(String UniCourseId);

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseName = :UniCourseName and uc.isActive = true")
    boolean existsByUniCourseName(String UniCourseName);

    @Query("update UniversityCourse uc set uc.isActive = false where uc.id = :uniId")
    @Modifying
    void deleteByUniId(Integer uniId);

    @Query("select uc from UniversityCourse uc where uc.id = :uniId and uc.isActive = true")
    Optional<UniversityCourse> findByUniId(Integer uniId);

    @Query("select uc from UniversityCourse uc where uc.uniCourseId = :uniCourseId and uc.isActive = true")
    Optional<UniversityCourse> findByUniCourseId(String uniCourseId);




}
