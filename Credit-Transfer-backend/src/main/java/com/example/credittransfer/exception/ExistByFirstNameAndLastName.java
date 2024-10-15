package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByFirstNameAndLastName extends RuntimeException {
    public ExistByFirstNameAndLastName(String firstName, String lastName) {
        super("ชื่อและนามสกุลนี้มีอยู่ในระบบอยู่แล้ว : " + firstName + " " + lastName);
    }
}
