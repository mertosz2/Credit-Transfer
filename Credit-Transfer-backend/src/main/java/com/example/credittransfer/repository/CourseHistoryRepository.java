package com.example.credittransfer.repository;

import com.example.credittransfer.entity.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Integer> {

    @Query("select c from CourseHistory c where c.users.usersId = :usersId")
    List<CourseHistory> findByUsersId(Integer usersId);
}
