package com.example.credittransfer.repository;


import com.example.credittransfer.entity.DiplomaCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiplomaCourseRepository extends JpaRepository<DiplomaCourse, Integer> {

    @Query("select d from DiplomaCourse d where d.dipCourseId in :dipCourseIdList and d.isActive = true")
    List<DiplomaCourse> findByDipCourseIdList(List<String> dipCourseIdList);

    @Query("select d from DiplomaCourse d where d.dipCourseId = :dipCourseId and d.isActive = true")
    DiplomaCourse findByDipCourseId(String dipCourseId);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseId = :dipCourseId and d.dipCourseName = :dipCourseName and d.isActive = true ")
    boolean existsByDipCourseIdAndDipCourseName(String dipCourseId, String dipCourseName);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseId = :dipCourseId and d.isActive = true")
    boolean existsByDipCourseId(String dipCourseId);

    @Query("select case when count(d) > 0 then true else false end from DiplomaCourse d where d.dipCourseName = :dipCourseName and d.isActive = true")
    boolean existsByDipCourseName(String dipCourseName);

    @Query("select d from DiplomaCourse d where d.isActive = true")
    List<DiplomaCourse> findAll();

    @Query("update DiplomaCourse d set d.isActive = false where d.id = :dipId and d.isActive = true ")
    @Modifying
    void deleteByDipId(Integer dipId);

    @Query("select d from DiplomaCourse d where d.id = :dipId and d.isActive = true")
    Optional<DiplomaCourse> findByDipId(Integer dipId);





}
