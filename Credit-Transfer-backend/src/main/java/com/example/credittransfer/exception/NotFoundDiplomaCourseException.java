package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundDiplomaCourseException extends RuntimeException {
    public NotFoundDiplomaCourseException(String msg) {
        super("ไม่พบรหัสวิชานี้: " + msg + " หรือว่ารหัสวิชานี้ยังไม่ได้ลงทะเบียนกับระบบ.");
    }

}
