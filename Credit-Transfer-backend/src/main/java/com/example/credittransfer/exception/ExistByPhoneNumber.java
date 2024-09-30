package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ExistByPhoneNumber extends RuntimeException {
    public ExistByPhoneNumber(String phone) {
        super("เบอร์โทรศัพท์นี้ถูกใช้ไปแล้ว: " + phone);
    }
}
