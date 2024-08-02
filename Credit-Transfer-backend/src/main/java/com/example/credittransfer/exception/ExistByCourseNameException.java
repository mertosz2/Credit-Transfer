package com.example.credittransfer.exception;

public class ExistByCourseNameException extends RuntimeException{
    public ExistByCourseNameException(String msg){
        super("ชื่อวิชานี้มีอยู่ในระบบอยู่แล้ว : " + msg);
    }
}
