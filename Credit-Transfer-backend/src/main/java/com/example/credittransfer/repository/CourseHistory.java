package com.example.credittransfer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseHistory extends JpaRepository<CourseHistory, Integer> {
}
