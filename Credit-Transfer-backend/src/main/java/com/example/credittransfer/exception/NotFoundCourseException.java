package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundCourseException extends RuntimeException {
    public NotFoundCourseException(String msg) {
        super("The transcript was too blurry, or no such course exists in this file: " + msg + "please fill the course code manually.");
    }
}
