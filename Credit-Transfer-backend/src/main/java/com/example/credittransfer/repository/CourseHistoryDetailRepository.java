package com.example.credittransfer.repository;

import com.example.credittransfer.entity.CourseHistoryDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseHistoryDetailRepository extends JpaRepository<CourseHistoryDetail, Integer> {

    @Query("select chd from CourseHistoryDetail chd where chd.courseHistory.chId = :chId")
    List<CourseHistoryDetail> findByChId(Integer chId);


}
