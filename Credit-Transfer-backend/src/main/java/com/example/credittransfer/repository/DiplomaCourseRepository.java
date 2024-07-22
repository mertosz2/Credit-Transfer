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
}
