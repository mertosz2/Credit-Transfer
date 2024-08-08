package com.example.credittransfer.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CourseHistoryResponse {

    private List<TransferCreditResponse> transferCreditResponseList;
}
