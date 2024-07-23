package com.example.credittransfer.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferCreditRequest {

    private String dipCourseId;

    private double dipGrade;

}
