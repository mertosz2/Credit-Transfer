package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByDepartmentNameException extends RuntimeException{
    public ExistByDepartmentNameException(String msg){
        super("มีชื่อหน่วยงานนี้ในระบบอยู่แล้ว : " + msg);
    }
}
