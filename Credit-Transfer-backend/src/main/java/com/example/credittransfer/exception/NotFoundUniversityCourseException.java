package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundUniversityCourseException extends RuntimeException {
    public NotFoundUniversityCourseException(String msg) {
        super("ไม่พบวิชานี้ในระบบ: " + msg );
    }
}
