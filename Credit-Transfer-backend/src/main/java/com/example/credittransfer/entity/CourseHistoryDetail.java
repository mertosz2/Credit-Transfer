package com.example.credittransfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "course_history_detail")
public class CourseHistoryDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chdId;

    @ManyToOne
    @JoinColumn(name = "dip_id")
    private DiplomaCourse diplomaCourse;

    @ManyToOne
    @JoinColumn(name = "ch_id")
    private CourseHistory courseHistory;

    private double dipGrade;
}
