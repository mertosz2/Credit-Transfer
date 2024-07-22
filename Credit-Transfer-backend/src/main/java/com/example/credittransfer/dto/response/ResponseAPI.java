package com.example.credittransfer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAPI {

    private HttpStatus httpStatus;
    private String message;
    private Object data;
    private List<Object> datalist;

    public ResponseAPI(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
