package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByCourseNameException extends RuntimeException{
    public ExistByCourseNameException(String msg){
        super("ชื่อวิชานี้มีอยู่ในระบบอยู่แล้ว : " + msg);
    }
}
