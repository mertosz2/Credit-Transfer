package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiplomaCourseResponse {

    private int id;

    private String dipCourseId;

    private String dipCourseName;

    private int dipCredit;

    private String uniCourseId;

    private String createdBy;

    private String createdDate;

    private String lastModifiedBy;

    private String lastModifiedDate;

}
