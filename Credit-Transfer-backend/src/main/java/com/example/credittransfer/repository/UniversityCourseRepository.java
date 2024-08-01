package com.example.credittransfer.repository;

import com.example.credittransfer.entity.UniversityCourse;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityCourseRepository extends JpaRepository<UniversityCourse, Integer> {

//    @Query("select case when count(u) > 0 then true else false from UniversityCourse u where u.uniCourseId = :uniCourseId")
//    boolean existsByUniCourseId(Integer uniCourseId);

    @Query("select u.id as id, u.uniCourseId as value, concat(u.uniCourseId,' - ') as label from UniversityCourse u")
    List<DropDown> getUniversityCoursesDropDown();

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseId = :UniCourseId")
    boolean existsByUniCourseId(String UniCourseId);

    @Query("select case when count(uc) > 0 then true else false end from UniversityCourse uc where uc.uniCourseName = :UniCourseName")
    boolean existsByUniCourseName(String UniCourseName);
}
