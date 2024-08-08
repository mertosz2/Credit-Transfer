package com.example.credittransfer.dto.response;

import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.entity.UniversityCourse;
import lombok.Data;

import java.util.List;

@Data

public class TransferCreditResponse {

    private List<DipCourseResponse> diplomaCourseList;

    private UniversityCourse universityCourse;

    private boolean isTransferable;
}
