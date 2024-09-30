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

    @NotBlank(message = "กรุณาใส่รหัสวิชา")
    @Pattern(regexp = "^[A-Z]{2}-\\d{3}", message = "รูปแบบของรหัสวิชาเป็นดังนี้ xx-xxx , ตัวอย่าง. SP-102")
    private String uniCourseId;

    @NotBlank(message = "กรุณาใส่ขื่อวิชา")
    private String uniCourseName;

    @NotNull(message = "กรุณาใส่หน่วยกิต")
    private int uniCredit;

    private String preSubject;

    private int courseCategory;
}
