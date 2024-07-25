package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DipCourseResponse {

    private int id;

    private String dipCourseId;

    private String dipCourseName;

    private int dipCredit;

    private double grade;
}
