package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponse {

    private int departmentId;

    private String departmentName;

    private String createdBy;

    private String createdDate;

    private String lastModifiedBy;

    private String lastModifiedDate;
}