package com.example.credittransfer.exception;

public class ExistByCourseIdException extends RuntimeException{
    public ExistByCourseIdException(String msg){
        super("course code already exist : " + msg);
    }
}
