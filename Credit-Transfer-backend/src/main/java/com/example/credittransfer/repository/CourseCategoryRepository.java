package com.example.credittransfer.repository;

import com.example.credittransfer.entity.CourseCategory;
import com.example.credittransfer.projection.DropDown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseCategoryRepository extends JpaRepository<CourseCategory, Integer> {

    @Query("select c.ccId as id, concat(c.courseCategoryCode,'-',c.courseCategoryName) as label, c.courseCategoryCode as value from CourseCategory c")
    List<DropDown> getCourseCategoryDropdown();
}
