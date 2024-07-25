package com.example.credittransfer.exception;

public class ExistByCourseIdException extends RuntimeException{
    public ExistByCourseIdException(String msg){
        super("รหัสวิชานี้มีอยู่ในระบบอยู่แล้ว : " + msg);
    }
}
