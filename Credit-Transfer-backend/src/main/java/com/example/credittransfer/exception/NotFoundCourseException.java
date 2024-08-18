package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundCourseException extends RuntimeException {
    public NotFoundCourseException(String msg) {
        super("ภาพทรานสคริปไม่ชัดเจน หรือว่่าไม่พบวิชาที่ลงทะเบียนกับระบบในไฟล์นี้: " + msg + " กรุณากรอกรหัสวิชาด้วยตนเอง.");
    }
}
