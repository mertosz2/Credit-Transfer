package com.example.credittransfer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FileExtensionNotMatchException extends RuntimeException{
    public FileExtensionNotMatchException(String msg) {
        super("file extension not match the system only accept these extensions: .pdf / .jpg / .png " );
    }
}
