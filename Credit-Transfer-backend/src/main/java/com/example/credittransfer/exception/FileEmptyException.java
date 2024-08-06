package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FileEmptyException extends RuntimeException {
    public FileEmptyException() {
        super("File is empty");
    }
}
