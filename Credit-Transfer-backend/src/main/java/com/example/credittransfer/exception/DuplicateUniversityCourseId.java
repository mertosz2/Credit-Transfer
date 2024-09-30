package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuplicateUniversityCourseId extends RuntimeException{
    public DuplicateUniversityCourseId(String msg){
        super("รหัสวิชานี้มีอยู่ในระบบอยู่แล้ว : " + msg);
    }
}
