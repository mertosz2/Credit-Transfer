package com.example.credittransfer.dto.response;

import lombok.Data;

import java.util.List;
@Data
public class ReportCourseResponse {

    public List<TransferCreditResponse> firstSectionList;
    public List<TransferCreditResponse> secondSectionList;
    public List<TransferCreditResponse> thirdSectionList;
}
