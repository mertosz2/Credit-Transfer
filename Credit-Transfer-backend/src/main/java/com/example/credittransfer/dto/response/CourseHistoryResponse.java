package com.example.credittransfer.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CourseHistoryResponse {
    private Integer chId;
    private List<TransferCreditResponse> transferCreditResponseList;
}
