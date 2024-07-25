package com.example.credittransfer.exception;

public class ExistByCourseNameException extends RuntimeException{
    public ExistByCourseNameException(String msg){
        super("วิชานี้มีอยู่ในระบบอยู่แล้ว : " + msg);
    }
}
