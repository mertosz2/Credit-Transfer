"use client";
import useGetCreditTransfer from "@/feature/CreditTransfer/hooks/useGetCreditTransfer";
import { ICreditTransferResponse } from "@/feature/CreditTransfer/interface/CreditTransfer";
;
import { Box } from "@chakra-ui/react";
import React from "react";

export default function MainPage() {
  
  const { creditTransferData } = useGetCreditTransfer();
  console.log(creditTransferData)

  return (
    <Box
      width="100%"
      height="100vh"
      background="radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)"
    >
      <Box display="flex" width="100%" height="100%" backgroundColor="white">
        <Box
          display="flex"
          flexDirection="column"
          padding="24px"
          width="20%"
          height="100%"
          borderWidth="1px"
          borderColor="black"
          alignItems="center"
          backgroundColor="yellow"
        >
          <Box>asdasd</Box>
          <Box>asdasd</Box>
          <Box>asdasd</Box>
          <Box>asdasd</Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          backgroundColor="white"
        >
          <Box
            display="flex"
            alignItems="center"
            backgroundColor="blue"
            flexDirection="column"
          >
            <Box>asdasd</Box>
            <Box>asdasd</Box>
            <Box>asdasd</Box>
          </Box>
          <Box
            marginTop="24px"
            display="flex"
            flexDirection="column"
            padding="24px"
          >
            {/* {creditTransferData?.diplomaCourseList?.length ? (
              creditTransferData.diplomaCourseList.map(
                (course: IDiplomaCourseList, courseIndex: number) => (
                  <CreditTransferTable
                    key={courseIndex}
                    dipData={course}
                    uniData={creditTransferData.universityCourse}
                  />
                )
              )
            ) : (
              <Box>No data available</Box>
            )} */}
            {/* {creditTransferData?.map((course: ICreditTransferResponse, index:number)=>(
              {course.}
            )
              return(
                <Box display="flex" flexDirection="column" key={index}>
                  <Box>{course.}</Box>
                  <Box>{course.dipCourseName}</Box>
                  <Box>{course.dipCredit}</Box>
                  <Box>{course.grade}</Box>
                </Box>
              )
            )} */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
