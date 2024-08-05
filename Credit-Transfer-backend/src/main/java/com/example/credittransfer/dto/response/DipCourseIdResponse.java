package com.example.credittransfer.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DipCourseIdResponse {

    private List<String> foundedDipCourseIdList;
    private List<String> notFoundedDipCourseIdList;
    private List<TransferCreditResponse> transferCreditResponseList;
    private int total;
}
