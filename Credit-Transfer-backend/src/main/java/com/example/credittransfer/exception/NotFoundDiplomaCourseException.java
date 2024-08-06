package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundDiplomaCourseException extends RuntimeException {
    public NotFoundDiplomaCourseException(String msg) {
        super("Not found diploma course with given course code: " + msg + " or this course does not register in the system yet.");
    }

}
