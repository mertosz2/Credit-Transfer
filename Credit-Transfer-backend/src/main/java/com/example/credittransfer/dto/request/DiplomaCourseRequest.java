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

    @NotBlank(message = "กรุณาใส่รหัสวิชา")
    @Pattern(regexp = "\\d{5}-\\d{4}", message = "รูปแบบของรหัสวิชาเป็นดังนี้ 'xxxxx-xxxx, ตัวอย่าง. 30000-1212")
    private String dipCourseId;

    @NotBlank(message = "กรุณาใส่ชื่อวิชา")
    private String dipCourseName;

    @NotNull(message = "กรุณาใส่หน่วยกิต")
    private int dipCredit;

    @NotNull(message = "กรุณาเลือกวิชาที่จะเทียบโอน")
    private Integer uniId;

    private int dipGrade;
}
