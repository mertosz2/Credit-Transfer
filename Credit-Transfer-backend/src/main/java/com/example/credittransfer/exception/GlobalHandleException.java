package com.example.credittransfer.exception;

import com.example.credittransfer.dto.response.ResponseAPI;
import io.jsonwebtoken.ExpiredJwtException;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    @ExceptionHandler(NotFoundUniversityCourseException.class)
    public ResponseEntity<Object> handleNotFoundUniversityCourseException(NotFoundUniversityCourseException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @ExceptionHandler(FileEmptyException.class)
    public ResponseEntity<Object> handleFileEmptyException(FileEmptyException ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String message = error.getDefaultMessage();
            errors.add(message);
        });
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                errors.toString()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }
    @ExceptionHandler(ExistByFirstNameAndLastName.class)
    public ResponseEntity<Object> handleExistByFirstNameAndLastName(ExistByFirstNameAndLastName ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }
    @ExceptionHandler(ExistByPhoneNumber.class)
    public ResponseEntity<Object> handleExistByPhoneNumber(ExistByPhoneNumber ex) {
        ResponseAPI responseAPI = new ResponseAPI(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(responseAPI, responseAPI.getHttpStatus());
    }
}
