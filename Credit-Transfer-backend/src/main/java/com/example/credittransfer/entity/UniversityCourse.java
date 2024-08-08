package com.example.credittransfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UniversityCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uniId;

    private String uniCourseId;

    private String uniCourseName;

    private int uniCredit;

    private boolean isActive;

}
