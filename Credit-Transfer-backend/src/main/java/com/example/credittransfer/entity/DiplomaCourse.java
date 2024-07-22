package com.example.credittransfer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiplomaCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String dipCourseId;

    private String dipCourseName;

    private int dipCredit;

    @ManyToOne
    @JoinColumn(name = "universityCourse_id")
    private UniversityCourse universityCourse;
}
