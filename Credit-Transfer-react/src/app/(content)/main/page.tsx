"use client";
import Button from "@/app/components/Button";
import useGetCreditTransfer from "@/feature/CreditTransfer/hooks/useGetCreditTransfer";
import { ICreditTransferResponse, IDiplomaCourseList } from "@/feature/CreditTransfer/interface/CreditTransfer";
import useGetDipCourseById from "@/feature/getDipCourseById/hooks/useGetDipCourseById";
import useCreditTransferStore, {
  selectOnSetCreditTransferData,
  selectOnSetUniversityCourseData,
} from "@/stores/creditTransferStore";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Th,
  Tr,
  Input,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

export default function Main() {
  const { creditTransferData } = useGetCreditTransfer();
  const { onUpdateDipCourse } = useGetDipCourseById();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [dipCourse, setDipCourse] = useState("");
  const OnsetDipData = useCreditTransferStore(selectOnSetCreditTransferData);
  const OnsetUniData = useCreditTransferStore(selectOnSetUniversityCourseData);
 

  const isValidNumberInput = (value: string): boolean => {
    if (value === "") return true;
    if (/^4(\.0)?$/.test(value)) {
      return true;
    }
    if (/^[1-3](\.[05]?)?$/.test(value)) {
      return true;
    }
    return false;
  };
console.log(creditTransferData)
  const handleGradeChange =
    (itemIndex: number, courseIndex: number) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target;
      const key = `${itemIndex}-${courseIndex}`;

      if (isValidNumberInput(value)) {
        setGrades((prevGrades) => ({
          ...prevGrades,
          [key]: value,
        }));
      }
    };

  const handleDipCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDipCourse(e.target.value); // อัปเดตค่า state เมื่อมีการเปลี่ยนแปลงใน input
  };

  const handleSubmit = async () => {
    
    if (dipCourse) {
      try {
        const newDipCourse = await onUpdateDipCourse(dipCourse);
        const newArray = creditTransferData ? [...creditTransferData, ...newDipCourse] : [...newDipCourse];
        console.log(newDipCourse)

      } catch (error) {
        console.error("Failed to update DipCourse:", error);
      }
    }
  };
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
            <TableContainer>
              <Table
                sx={{ tableLayout: "auto" }}
                style={{
                  borderWidth: 2,
                  borderColor: "pink",
                  borderRadius: 16,
                }}
              >
                <Thead style={{ borderWidth: 1, borderColor: "black" }}>
                  <Tr>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">
                        วิชาที่ขอเทียบโอน{"\n"}Course Transferred From
                      </Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">เกรด{"\n"}Grade</Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">
                        วิชาที่เทียบโอนหน่วยกิตได้{"\n"}Transferred Course
                        Equivalents
                      </Box>
                    </Th>
                    <Th style={{ borderWidth: 1, borderColor: "black" }}>
                      <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {newArray?.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                      {item.diplomaCourseList.map((course, courseIndex) => (
                        
                        <Tr key={course.dipCourseId}>
                          <Td style={{ borderWidth: 1, borderColor: "black" }}>
                            {course.dipCourseId}
                          </Td>
                          <Td style={{ borderWidth: 1, borderColor: "black" }}>
                            {course.dipCourseName}
                          </Td>
                          <Td style={{ borderWidth: 1, borderColor: "black" }}>
                            <Input
                              sx={{
                                border: "none",
                                width: "60px",
                                height: "30px",
                              }}
                              value={
                                grades[`${itemIndex}-${courseIndex}`] || ""
                              }
                              onChange={handleGradeChange(
                                itemIndex,
                                courseIndex
                              )}
                            />
                          </Td>
                          <Td style={{ borderWidth: 1, borderColor: "black" }}>
                            {course.dipCredit}
                          </Td>
                          {courseIndex === 0 && (
                            <>
                              <Td
                                style={{ borderWidth: 1, borderColor: "black" }}
                                rowSpan={item.diplomaCourseList.length}
                              >
                                {item.universityCourse.uniCourseId}
                              </Td>
                              <Td
                                style={{ borderWidth: 1, borderColor: "black" }}
                                rowSpan={item.diplomaCourseList.length}
                              >
                                {item.universityCourse.uniCourseName}
                              </Td>
                              <Td
                                style={{ borderWidth: 1, borderColor: "black" }}
                                rowSpan={item.diplomaCourseList.length}
                              >
                                {item.universityCourse.uniCredit}
                              </Td>
                            </>
                          )}
                        </Tr>
                      ))}
                    </React.Fragment>
                  ))}
                </Tbody>
                <Tr>
        <Td colSpan={4}>
          <Input
            value={dipCourse}
            onChange={handleDipCourseChange}
            placeholder="Enter Dip Course ID"
          />
        </Td>
        <Td>
          <Button label={"Submit"} onClick={handleSubmit} />
        </Td>
      </Tr>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
