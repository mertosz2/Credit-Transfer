package com.example.credittransfer.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferCreditRequest {

    private int dipId;

    private double dipGrade;

}
