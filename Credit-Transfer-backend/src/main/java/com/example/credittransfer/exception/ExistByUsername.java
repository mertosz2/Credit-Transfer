package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByUsername extends RuntimeException {
    public ExistByUsername(String username) {
        super("ชื่อผู้ใช้นี้มีอยู่ในระบบอยู่แล้ว : " + username);
    }
}
