package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UniversityCourseRequest {

    @NotEmpty(message = "Course id can not be null or empty")
    private String uniCourseId;

    @NotEmpty(message = "Course name can not be null or empty")
    private String uniCourseName;

    @NotNull(message = "Credit can not be null or empty")
    private int uniCredit;
}
