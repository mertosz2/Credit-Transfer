package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByCourseNameException extends RuntimeException{
    public ExistByCourseNameException(String msg){
        super("course name already exist : " + msg);
    }
}
