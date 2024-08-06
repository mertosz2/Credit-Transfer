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
public class DiplomaCourseRequest {

    @NotBlank(message = "Course id can not be null or empty")
    @Pattern(regexp = "\\d{5}-\\d{4}", message = "course code pattern is 'xxxxx-xxxx, ex. 30000-1212")
    private String dipCourseId;

    @NotBlank(message = "Course name can not be null or empty")
    private String dipCourseName;

    @NotNull(message = "Credit can not be null or empty")
    private int dipCredit;

    @NotNull(message = "course can not be null or empty")
    private Integer uniId;

    private int dipGrade;
}
