package com.example.credittransfer.repository;


import com.example.credittransfer.entity.DiplomaCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiplomaCourseRepository extends JpaRepository<DiplomaCourse, Integer> {

    @Query("select d from DiplomaCourse d where d.dipCourseId in :dipCourseIdList")
    List<DiplomaCourse> findByDipCourseIdList(List<String> dipCourseIdList);

    @Query("select d from DiplomaCourse d where d.dipCourseId = :dipCourseId")
    DiplomaCourse findByDipCourseId(String dipCourseId);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseId = :dipCourseId and d.dipCourseName = :dipCourseName")
    boolean existsByDipCourseIdAndDipCourseName(String dipCourseId, String dipCourseName);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseId = :dipCourseId")
    boolean existsByDipCourseId(String dipCourseId);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseName = :dipCourseName")
    boolean existsByDipCourseName(String dipCourseName);
}
