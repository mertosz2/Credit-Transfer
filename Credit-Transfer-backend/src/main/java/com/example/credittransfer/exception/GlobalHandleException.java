package com.example.credittransfer.exception;

import com.example.credittransfer.dto.response.ResponseAPI;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalHandleException extends ResponseEntityExceptionHandler {

    @ExceptionHandler(FileExtensionNotMatchException.class)
    public ResponseEntity<Object> handleFileExtensionNotMatchException(FileExtensionNotMatchException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @ExceptionHandler(NotFoundCourseException.class)
    public ResponseEntity<Object> handleNotFoundCourseException(NotFoundCourseException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @ExceptionHandler(ExistByCourseIdException.class)
    public ResponseEntity<Object> handleExistByCourseIdException(ExistByCourseIdException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @ExceptionHandler(ExistByCourseNameException.class)
    public ResponseEntity<Object> handleExistByCourseNameException(ExistByCourseNameException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @ExceptionHandler(NotFoundDiplomaCourseException.class)
    public ResponseEntity<Object> handleNotFoundDiplomaCourseException(NotFoundDiplomaCourseException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }



}
