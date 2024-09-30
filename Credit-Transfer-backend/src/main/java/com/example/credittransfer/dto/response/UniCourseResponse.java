package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniCourseResponse {

    private int uniId;

    private String uniCourseId;

    private String uniCourseName;

    private int uniCredit;

    private String preSubject;

    private String courseCategory;

    private String createdBy;

    private String createdDate;

    private String lastModifiedBy;

    private String lastModifiedDate;
}
