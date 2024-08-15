"use client";
import Button from "@/components/Button";
import useGetCreditTransfer from "@/feature/CreditTransfer/hooks/useGetCreditTransfer";
import {
  ICreditTransferResponse,
  IDiplomaCourseList,
} from "@/feature/CreditTransfer/interface/CreditTransfer";
import useGetDipCourseById from "@/feature/getDipCourseById/hooks/useGetDipCourseById";
import useGetUploadFileCreditTransfer from "@/feature/UploadFileCreditTransfer/hooks/useGetUploadFileCreditTransfer";
import { IUploadFileResponse } from "@/feature/UploadFileCreditTransfer/interface/UploadFileCreditTransfer";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Tfoot,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import useTransferable from "@/feature/CreditTransfer/hooks/useTransferable";

export default function Main() {
  const { onUpdateDipCourse } = useGetDipCourseById();
  const { onUploadFile, isPending } = useGetUploadFileCreditTransfer();
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [dipCourse, setDipCourse] = useState("");
  const toast = useToast();
  const {onTransferable} =useTransferable()

  const [file, setFile] = useState<File | undefined>(undefined);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState<
    { founded: string[]; notFounded: string[] } | undefined
  >(undefined);
  const [displayData, setDisplayData] = useState<ICreditTransferResponse[]>([]);

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

  const updateGradesInDisplayData = () => {
    setDisplayData((prevDisplayData) => 
      prevDisplayData.map((item, itemIndex) => {
        return {
          ...item,
          diplomaCourseList: item.diplomaCourseList.map((course, courseIndex) => {
            const key = `${itemIndex}-${courseIndex}`;
            const grade = grades[key] !== undefined ? grades[key] : 0; // ใช้ค่า number ที่มีจุดทศนิยม หรือค่าเริ่มต้นเป็น 0
            return {
              ...course,
              grade // เพิ่มเกรดที่กรอกไป
            };
          })
        };
      })
    );
  };
  const handleGradeChange = (itemIndex: number, courseIndex: number) => (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const key = `${itemIndex}-${courseIndex}`;
  
    if (isValidNumberInput(value)) {
      // แปลงค่าเป็น number ก่อนอัปเดต state
      setGrades((prevGrades) => {
        const updatedGrades = { ...prevGrades, [key]: parseFloat(value) || 0 };
        updateGradesInDisplayData(); // เรียกใช้เพื่อรวมเกรดใน displayData
        return updatedGrades;
      });
    }
  };
  const handleDipCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDipCourse(e.target.value);
  };


  const handleSubmit = async () => {
    if (dipCourse) {
      try {
        const transferCreditResponseList = displayData || [];

        const isDipCourseExists = transferCreditResponseList.some((item) =>
          item.diplomaCourseList.some(
            (course) => course.dipCourseId === dipCourse
          )
        );

        if (isDipCourseExists) {
          toast({
            title: "DipCourse already exists in the list.",
            status: "error",
            isClosable: true,
          });
          return;
        }

        const newDipCourse = await onUpdateDipCourse(dipCourse);

        const existingIndex = transferCreditResponseList.findIndex(
          (item) =>
            item.universityCourse.uniCourseId ===
            newDipCourse.universityCourse.uniCourseId
        );

        let newArray;

        if (existingIndex > -1) {
          const mergedDiplomaCourseList = [
            ...transferCreditResponseList[existingIndex].diplomaCourseList,
            ...newDipCourse.diplomaCourseList,
          ];

          const uniqueDiplomaCourseList = mergedDiplomaCourseList.filter(
            (course, index, self) =>
              index === self.findIndex((c) => c.id === course.id)
          );

          const updatedItem = {
            ...transferCreditResponseList[existingIndex],
            diplomaCourseList: uniqueDiplomaCourseList,
          };

          newArray = [
            ...transferCreditResponseList.slice(0, existingIndex),
            updatedItem,
            ...transferCreditResponseList.slice(existingIndex + 1),
          ];
        } else {
          newArray = [...transferCreditResponseList, newDipCourse];
        }

        setDisplayData(newArray);

        console.log("Updated Display Data:", newArray);
      } catch (error) {
        console.error("Failed to update DipCourse:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileSizeInMB = selectedFile.size / 1024 / 1024; // Convert bytes to MB
      const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

      if (allowedFileTypes.includes(selectedFile.type)) {
        if (fileSizeInMB <= 10) {
          setFile(selectedFile);
        } else {
          toast({
            title: "File size should not exceed 10 MB.",
            status: "error",
            isClosable: true,
          });
          setFile(undefined);
        }
      } else {
        toast({
          title: "Only PNG, JPG, and PDF files are allowed.",
          status: "error",
          isClosable: true,
        });
        setFile(undefined);
      }
    } else {
      setFile(undefined);
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      try {
        const newFile = await onUploadFile(file);
        console.log("list of", newFile.transferCreditResponseList);
        if (newFile) {
          const newIm = newFile.transferCreditResponseList;
          const transferCreditResponseList = displayData || [];

          const newArray = [...transferCreditResponseList, ...newIm];

          setDisplayData(newArray);
          setModalData({
            founded: newFile.foundedDipCourseIdList,
            notFounded: newFile.notFoundedDipCourseIdList,
          });
          onOpen();
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  };
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ICreditTransferResponse | string | null;
    direction: "ascending" | "descending";
  } | null>(null);

  // ฟังก์ชันสำหรับจัดการการเรียงลำดับ
  const handleSort = (key: keyof ICreditTransferResponse | string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    const sortedData = [...displayData].sort((a, b) => {
      const aValue = Array.isArray(a)
        ? getNestedValue(a[0], key)
        : getNestedValue(a, key);
      const bValue = Array.isArray(b)
        ? getNestedValue(b[0], key)
        : getNestedValue(b, key);

      const aNum = isNaN(Number(aValue)) ? aValue : Number(aValue);
      const bNum = isNaN(Number(bValue)) ? bValue : Number(bValue);

      if (aNum < bNum) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aNum > bNum) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setDisplayData(sortedData);
    setSortConfig({ key, direction });
  };

  // ฟังก์ชันสำหรับดึงค่า nested key
  const getNestedValue = (obj: any, path: string) => {
    const pathParts = path.split(".");
    let value = obj;

    for (const part of pathParts) {
      if (Array.isArray(value)) {
        // Handle array case
        value = value.map((item) => item[part]);
        if (value.length > 0) {
          value = value[0]; // Take the first item in the array
        } else {
          value = undefined;
        }
      } else {
        value = value ? value[part] : undefined;
      }
    }

    // Remove hyphens
    return typeof value === "string" ? value.replace(/-/g, "") : value;
  };
  const onSubmitCreditTransferData =async () =>{
 const creditTransferData = await onTransferable(displayData)
 console.log(creditTransferData)
  }
  return (
    <Box
      height="100vh"
      // background="radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)"
    >
      <Box display="flex" height="100%">
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          // backgroundColor="white"
        >
          {/* <Box
            display="flex"
            alignItems="center"
            backgroundColor="blue"
            flexDirection="column"
          >
            <Box>asdasd</Box>
            <Box>asdasd</Box>
            <Box>asdasd</Box>
          </Box> */}

          <Box
            marginTop="24px"
            display="flex"
            flexDirection="column"
            padding="24px"
            alignItems="center"
            width="100%"
          >
            <Box display="flex" flexDirection="column" gap="24px">
              <Input
                type="file"
                onChange={handleFileChange}
                display="flex"
                alignItems="center"
              />
              <Button
                label="Upload"
                onClick={handleFileSubmit}
                isLoading={isPending}
              />
              {isPending && <Box>Uploading...</Box>}
            </Box>

            <TableContainer
              marginTop="24px"
              sx={{ tableLayout: "auto" }}
              style={{
                borderWidth: 1,
                borderColor: "pink",
                borderRadius: 16,
                maxWidth: "100%",
              }}
            >
              <Table size="sm">
                <Thead bgColor="#D7D7D7">
                  <Tr>
                    <Th
                      onClick={() =>
                        handleSort("diplomaCourseList.dipCourseId")
                      }
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">
                          รหัสวิชา{"\n"}Course Code
                        </Box>
                        {sortConfig?.key ===
                          "diplomaCourseList.dipCourseId" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th
                      onClick={() =>
                        handleSort("universityCourse.uniCourseName")
                      }
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">
                          วิชาที่ขอเทียบโอน{"\n"}Course Transferred From
                        </Box>
                        {sortConfig?.key ===
                          "universityCourse.uniCourseName" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th onClick={() => handleSort("grades")}>
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">เกรด{"\n"}Grade</Box>
                        {sortConfig?.key === "grades" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th
                      onClick={() => handleSort("diplomaCourseList.dipCredit")}
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>
                        {sortConfig?.key === "diplomaCourseList.dipCredit" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th
                      onClick={() => handleSort("universityCourse.uniCourseId")}
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">
                          รหัสวิชา{"\n"}Course Code
                        </Box>
                        {sortConfig?.key === "universityCourse.uniCourseId" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th
                      onClick={() =>
                        handleSort("universityCourse.uniCourseName")
                      }
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">
                          วิชาที่เทียบโอนหน่วยกิตได้{"\n"}Transferred Course
                          Equivalents
                        </Box>
                        {sortConfig?.key ===
                          "universityCourse.uniCourseName" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                    <Th
                      onClick={() => handleSort("universityCourse.uniCredit")}
                    >
                      <Box display="flex" alignItems="center">
                        <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>
                        {sortConfig?.key === "universityCourse.uniCredit" && (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                          />
                        )}
                      </Box>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {displayData.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                      {item.diplomaCourseList.map((course, courseIndex) => (
                        <Tr
                          key={course.dipCourseId}
                          borderBottom="gray"
                          borderWidth="2px"
                        >
                          <Td>{course.dipCourseId}</Td>
                          <Td>{course.dipCourseName}</Td>
                          <Td>
                            <Input type="number"
                            step="0.1"
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
                          <Td>{course.dipCredit}</Td>
                          {courseIndex === 0 && (
                            <>
                              <Td rowSpan={item.diplomaCourseList.length}>
                                {item.universityCourse.uniCourseId}
                              </Td>
                              <Td rowSpan={item.diplomaCourseList.length}>
                                {item.universityCourse.uniCourseName}
                              </Td>
                              <Td rowSpan={item.diplomaCourseList.length}>
                                {item.universityCourse.uniCredit}
                              </Td>
                            </>
                          )}
                        </Tr>
                      ))}
                    </React.Fragment>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td colSpan={4}>
                      <Input
                        value={dipCourse}
                        onChange={handleDipCourseChange}
                        placeholder="Enter Dip Course ID"
                      />
                    </Td>
                    <Td>
                      <Button label="Submit" onClick={handleSubmit} />
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Results</ModalHeader>
          <ModalBody>
            <Box mb={4}>
              <strong>Founded Courses:</strong>
              <ul>
                {modalData?.founded.map((courseId, index) => (
                  <li key={index}>{courseId}</li>
                ))}
              </ul>
            </Box>
            <Box>
              <strong>Not Founded Courses:</strong>
              <ul>
                {modalData?.notFounded.map((courseId, index) => (
                  <li key={index}>{courseId}</li>
                ))}
              </ul>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              label={"close"}
            ></Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button label="Summ" onClick={onSubmitCreditTransferData}></Button>
    </Box>
  );
}
//onClick={()=>{console.log(displayData)}}