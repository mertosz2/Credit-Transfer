package com.example.credittransfer.dto.response;

import com.example.credittransfer.entity.DiplomaCourse;
import lombok.Data;

import java.util.List;

@Data

public class TransferCreditResponse {

    private List<DiplomaCourse> diplomaCourseList;

    private String uniCourseId;

    private String uniCourseName;

    private int uniCredit;

    private boolean isTransferable;
}
