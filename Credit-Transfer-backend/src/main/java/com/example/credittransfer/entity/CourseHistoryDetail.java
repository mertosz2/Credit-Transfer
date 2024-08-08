package com.example.credittransfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CourseHistoryDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chd_id;

    @ManyToOne
    @JoinColumn(name = "dip_id")
    private DiplomaCourse diplomaCourse;

    @ManyToOne
    @JoinColumn(name = "ch_id")
    private CourseHistory courseHistory;

    private double dipGrade;
}
