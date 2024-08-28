package com.example.credittransfer.dto.response;

import com.example.credittransfer.entity.DiplomaCourse;
import com.example.credittransfer.entity.UniversityCourse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferCreditResponse {

    private List<DipCourseResponse> diplomaCourseList;

    private UniversityCourse universityCourse;

    private boolean isTransferable;
}
