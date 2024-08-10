package com.example.credittransfer.dto.request;

import com.example.credittransfer.entity.DiplomaCourse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferCreditRequest {

    private DiplomaCourse diplomaCourse;

    private double dipGrade;

}
