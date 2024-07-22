package com.example.credittransfer.exception;

public class DuplicateUniversityCourseId extends RuntimeException{
    public DuplicateUniversityCourseId(String msg){
        super("Duplicate University Course ID: " + msg);
    }
}
