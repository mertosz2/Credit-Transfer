package com.example.credittransfer.dto.response;

import lombok.Data;

@Data

public class TransferCreditResponse {

    private String uniCourseId;

    private String uniCourseName;

    private int uniCredit;

    private boolean isTransferable;
}
