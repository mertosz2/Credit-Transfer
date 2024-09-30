package com.example.credittransfer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UniversityCourseRequest {

    @NotBlank(message = "Course id can not be null or empty")
    @Pattern(regexp = "^[A-Z]{2}-\\d{3}", message = "course code pattern is xx-xxx , ex. SP-102")
    private String uniCourseId;

    @NotBlank(message = "Course name can not be null or empty")
    private String uniCourseName;

    @NotNull(message = "Credit can not be null or empty")
    private int uniCredit;

    private String preSubject;

    private int courseCategory;
}
