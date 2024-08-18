"use client"
import Button from "@/components/Button"
import {
  ICreditTransferResponse,
  IDiplomaCourseList,
  IUniversityCourse,
  IFlatDiplomaCourseList
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import useGetDipCourseById from "@/feature/getDipCourseById/hooks/useGetDipCourseById"
import useGetUploadFileCreditTransfer from "@/feature/UploadFileCreditTransfer/hooks/useGetUploadFileCreditTransfer"
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
  useToast
} from "@chakra-ui/react"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import useTransferable from "@/feature/CreditTransfer/hooks/useTransferable"
import { RiAddFill, RiCheckLine, RiErrorWarningFill } from "@remixicon/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState
} from "@tanstack/react-table"

export default function Main() {
  const { onUpdateDipCourse } = useGetDipCourseById()
  const { onUploadFile, isPending } = useGetUploadFileCreditTransfer()
  const [grades, setGrades] = useState<Record<string, number>>({})
  const [dipCourse, setDipCourse] = useState("")
  const toast = useToast()
  const { onTransferable } = useTransferable()

  const [file, setFile] = useState<File | undefined>(undefined)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: FileImport,
    onOpen: OpenFileImport,
    onClose: CloseFileImport
  } = useDisclosure()
  const {
    isOpen: AddCoure,
    onOpen: OpenAddCourse,
    onClose: CloseAddCourse
  } = useDisclosure()

  const [modalData, setModalData] = useState<
    | {
        founded: string[]
        notFounded: string[]
        duplicates?: string[]
        totalfound: number
        totalnotfound: number
        totalcourse: number
      }
    | undefined
  >(undefined)

  const [sorting, setSorting] = useState<SortingState>([])

  const [displayData, setDisplayData] = useState<ICreditTransferResponse[]>([])
  const [flatData, setFlatData] = useState<IFlatDiplomaCourseList[]>([])

  const flattenData = (data: ICreditTransferResponse[]) => {
    return data.reduce((acc: IFlatDiplomaCourseList[], item) => {
      item.diplomaCourseList.forEach((course, index) => {
        acc.push({
          ...course,
          universityCourse: item.universityCourse,
          transferable: item.transferable,
          isFirstInGroup: index === 0, // mark first item in each group
          groupSize: item.diplomaCourseList.length // size of the group
        })
      })
      return acc
    }, [])
  }

  const isValidNumberInput = (value: string): boolean => {
    if (value === "") return true
    if (/^4(\.0)?$/.test(value)) {
      return true
    }
    if (/^[1-3](\.[05]?)?$/.test(value)) {
      return true
    }
    return false
  }

  const calculateTransferable = (
    diplomaCourseList: IDiplomaCourseList[],
    universityCourse: IUniversityCourse
  ): boolean => {
    // ตรวจสอบว่ามีหลักสูตรมากกว่าหรือเท่ากับ 2 รายการ
    if (diplomaCourseList.length >= 2) {
      // ตรวจสอบว่าเกรดทั้งหมดใน diplomaCourseList >= 2 หรือไม่
      const allGradesValid = diplomaCourseList.every(
        (course) => course.grade >= 2
      )

      if (allGradesValid) {
        // รวมค่า dipCredit ใน diplomaCourseList
        const totalDipCredit = diplomaCourseList.reduce(
          (total, course) => total + course.dipCredit,
          0
        )

        // เปรียบเทียบ totalDipCredit กับ uniCredit
        return totalDipCredit >= universityCourse.uniCredit
      } else {
        return false
      }
    } else {
      // ถ้า diplomaCourseList.length < 2 ให้ตรวจสอบ dipCredit และ grade แต่ละรายการ
      return diplomaCourseList.some(
        (course) =>
          course.dipCredit >= universityCourse.uniCredit && course.grade >= 2
      )
    }
  }

  const handleSubmit = async () => {
    if (dipCourse) {
      try {
        const transferCreditResponseList = displayData || []

        const isDipCourseExists = transferCreditResponseList.some((item) =>
          item.diplomaCourseList.some(
            (course) => course.dipCourseId === dipCourse
          )
        )

        if (isDipCourseExists) {
          toast({
            title: "DipCourse already exists in the list.",
            status: "error",
            isClosable: true
          })
          return
        }

        const newDipCourse = await onUpdateDipCourse(dipCourse)

        const existingIndex = transferCreditResponseList.findIndex(
          (item) =>
            item.universityCourse.uniCourseId ===
            newDipCourse.universityCourse.uniCourseId
        )

        let newArray

        if (existingIndex > -1) {
          const mergedDiplomaCourseList = [
            ...transferCreditResponseList[existingIndex].diplomaCourseList,
            ...newDipCourse.diplomaCourseList
          ]

          const uniqueDiplomaCourseList = mergedDiplomaCourseList.filter(
            (course, index, self) =>
              index === self.findIndex((c) => c.id === course.id)
          )

          const updatedItem = {
            ...transferCreditResponseList[existingIndex],
            diplomaCourseList: uniqueDiplomaCourseList
          }

          newArray = [
            ...transferCreditResponseList.slice(0, existingIndex),
            updatedItem,
            ...transferCreditResponseList.slice(existingIndex + 1)
          ]
        } else {
          newArray = [...transferCreditResponseList, newDipCourse]
        }
        CloseAddCourse()
        setDisplayData(newArray)
        setFlatData(flattenData(displayData))
        console.log("Updated Display Data:", newArray)
      } catch (error) {
        console.error("Failed to update DipCourse:", error)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const fileSizeInMB = selectedFile.size / 1024 / 1024 // Convert bytes to MB
      const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"]

      if (allowedFileTypes.includes(selectedFile.type)) {
        if (fileSizeInMB <= 10) {
          setFile(selectedFile)
        } else {
          toast({
            title: "File size should not exceed 10 MB.",
            status: "error",
            isClosable: true
          })
          setFile(undefined)
        }
      } else {
        toast({
          title: "Only PNG, JPG, and PDF files are allowed.",
          status: "error",
          isClosable: true
        })
        setFile(undefined)
      }
    } else {
      setFile(undefined)
    }
  }

  const handleFileSubmit = async () => {
    if (file) {
      try {
        const newFile = await onUploadFile(file)

        console.log("list of", newFile.transferCreditResponseList)

        if (newFile) {
          const newIm = newFile.transferCreditResponseList
          const transferCreditResponseList = displayData || []

          // สร้าง Set ของ dipCourseId ที่มีอยู่ใน displayData
          const existingIds = new Set(
            transferCreditResponseList.flatMap((item) =>
              item.diplomaCourseList.map((course) => course.dipCourseId)
            )
          )

          // หาข้อมูลใหม่ที่ไม่มีใน existingIds
          const uniqueNewItems = newIm.filter(
            (item) =>
              !item.diplomaCourseList.some((course) =>
                existingIds.has(course.dipCourseId)
              )
          )

          // คำนวณ dipCourseId ที่ซ้ำ
          const duplicateIds = new Set<string>()

          newIm.forEach((item) =>
            item.diplomaCourseList.forEach((course) => {
              if (existingIds.has(course.dipCourseId)) {
                duplicateIds.add(course.dipCourseId)
              }
            })
          )

          const duplicateIdsArray = Array.from(duplicateIds)

          // อัปเดต displayData และ modalData
          const newArray = [...transferCreditResponseList, ...uniqueNewItems]
          setDisplayData(newArray)
          setFlatData(flattenData(displayData))
          setModalData({
            founded: newFile.foundedDipCourseIdList,
            notFounded: newFile.notFoundedDipCourseIdList,
            duplicates: duplicateIdsArray, // แสดงข้อมูลซ้ำใน modal
            totalfound: newFile.totalFounded,
            totalnotfound: newFile.totalNotFounded,
            totalcourse: newFile.total
          })

          // เปิด modal สำหรับการแสดงผล
          if (displayData.length > 0) {
            onOpen()
          } else {
            onOpen()
          }

          CloseFileImport()
        }
      } catch (error) {
        console.error("Failed to upload file:", error)
      }
    }
  }

  const onSubmitCreditTransferData = async () => {
    const creditTransferData = await onTransferable(displayData)
    console.log(creditTransferData)
  }

  const clearData = () => {
    console.log("Clearing data...")

    setDisplayData([])
    setFlatData([])
  }

  const handleDipCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDipCourse(e.target.value)
  }

  const handleGradeChange = (value: string, rowIndex: number) => {
    const newGrade = Number(value)
    if (!isNaN(newGrade) && isValidNumberInput(value)) {
      const updatedData = [...flatData]
      updatedData[rowIndex].grade = newGrade
      updatedData[rowIndex].transferable = newGrade >= 2 ? true : false
      setFlatData(updatedData)
    }
  }

  const columnHelper = createColumnHelper<IFlatDiplomaCourseList>()

  const columns = [
    columnHelper.accessor("dipCourseId", {
      header: "Course Code",
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor("dipCourseName", {
      header: "Course Transferred From",
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor("grade", {
      header: "Grade",
      cell: (info) => (
        <Input
          type="number"
          step="0.5"
          value={info.getValue() || 0}
          onChange={(e) => handleGradeChange(e.target.value, info.row.index)}
        />
      ),
      enableSorting: true
    }),
    columnHelper.accessor("dipCredit", {
      header: "Credit",
      cell: (info) => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor("universityCourse.uniCourseId", {
      header: "University Course Code",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      },
      enableSorting: true
    }),
    columnHelper.accessor("universityCourse.uniCourseName", {
      header: "Transferred Course Equivalents",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      },
      enableSorting: true
    }),
    columnHelper.accessor("universityCourse.uniCredit", {
      header: "University Credit",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      },
      enableSorting: true
    }),
    columnHelper.accessor("transferable", {
      header: "Status",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? (
          info.getValue() ? (
            <RiCheckLine color="green" />
          ) : (
            <RiErrorWarningFill color="red" />
          )
        ) : null
      },
      enableSorting: true
    })
  ]

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting
  })

  return (
    <Box height="100%">
      <Box
        display="flex"
        height="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
        >
          <Box
            display="flex"
            flexDirection="column"
            marginTop="60px"
            gap="24px"
            paddingRight="120px"
            paddingLeft="240px"
          >
            <Box
              display="flex"
              flexDirection="row"
              gap="24px"
              alignSelf="flex-end"
            >
              <Button
                label="อัพโหลดทรานสคริป"
                backgroundColor="#2E99FC"
                color="#FFFFFF"
                paddingY="14px"
                paddingX="79px"
                borderRadius="8px"
                onClick={OpenFileImport}
              />
            </Box>
            {/* Table */}
            <TableContainer
              sx={{ tableLayout: "auto" }}
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 16
              }}
            >
              <Table size="sm">
                <Thead bgColor="#D7D7D7">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const sortingState = header.column.getIsSorted()
                        const sortingIndicator =
                          sortingState === "asc"
                            ? " 🔼"
                            : sortingState === "desc"
                              ? " 🔽"
                              : null

                        return (
                          <Th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {sortingIndicator}
                          </Th>
                        )
                      })}
                    </Tr>
                  ))}
                </Thead>

                <Tbody>
                  {flatData &&
                    flatData.length > 0 &&
                    table.getRowModel().rows.map((row) => (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          // Apply colspan to universityCourse columns
                          if (cellIndex >= 4 && !row.original.isFirstInGroup) {
                            return null
                          }
                          return (
                            <Td
                              key={cell.id}
                              rowSpan={
                                row.original.isFirstInGroup && cellIndex >= 4
                                  ? row.original.groupSize
                                  : 1
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Td>
                          )
                        })}
                      </Tr>
                    ))}
                </Tbody>
                <Tfoot
                  display="flex"
                  padding="8px"
                ></Tfoot>
              </Table>
            </TableContainer>

            <Box
              borderRadius="16px"
              display="flex"
              width="100%"
              padding="16px"
              borderWidth={2}
              borderStyle="dashed"
              justifyContent="center"
            >
              <Box
                as="button"
                onClick={OpenAddCourse}
                display="flex"
                width="30px"
                height="30px"
                borderRadius="16px"
                backgroundColor="#2ABE0D"
                justifyContent="center"
                alignItems="center"
              >
                <RiAddFill color="#FFFFFF" />
              </Box>
            </Box>
            <Box
              display="flex"
              alignSelf="flex-end"
            >
              <Button
                label="ถัดไป"
                paddingY="14px"
                paddingX="62px"
                borderRadius="6px"
                onClick={onSubmitCreditTransferData}
                isDisabled={
                  displayData && displayData.length > 0 ? false : true
                }
                backgroundColor={
                  displayData && displayData.length > 0 ? "#2ABE0D" : ""
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent padding="12px">
          <ModalHeader>ผลลัพธ์</ModalHeader>
          <ModalBody>
            <Box
              mb={4}
              display="flex"
              gap="16px"
              flexDirection="column"
            >
              <Box fontWeight={700}>รหัสวิชาที่มีในระบบ</Box>
              <Box
                display="flex"
                flexWrap="wrap"
                gap="8px"
              >
                {modalData?.founded.map((courseId, index) => (
                  <Box key={index}>{`"${courseId}"${" "}`}</Box>
                ))}
              </Box>

              <Box>รหัสวิชาที่เจอในระบบ {modalData?.totalfound} วิชา</Box>
              <Box
                width="100%"
                height="1px"
                backgroundColor="black"
              ></Box>
            </Box>
            <Box
              mb={4}
              display="flex"
              gap="16px"
              flexDirection="column"
            >
              <Box fontWeight={700}>รหัสวิชาที่ไม่มีในระบบ</Box>
              <Box
                display="flex"
                flexWrap="wrap"
                gap="8px"
              >
                {modalData?.notFounded.map((courseId, index) => (
                  <Box key={index}>{`"${courseId}"${" "}`}</Box>
                ))}
              </Box>

              <Box>รหัสวิชาที่ไม่เจอในระบบ {modalData?.totalnotfound} วิชา</Box>
              <Box
                width="100%"
                height="1px"
                backgroundColor="black"
              ></Box>
              <Box>
                พบรหัสวิชาในใบทรานสคริปทั้งหมด {modalData?.totalcourse} วิชา
              </Box>
              <Box
                color="red"
                fontSize="14px"
                textAlign="center"
              >
                *โปรดตรวจสอบว่ารหัสวิชาครบถ้วนตามใบทรานสคริปหรือไม่
                หากไม่พบท่านสามารถทำการเพิ่มรหัสวิชาลงไปเองได้*
              </Box>
            </Box>
            {modalData?.duplicates && modalData.duplicates.length > 0 && (
              <Box>
                <strong>Duplicate Courses:</strong>
                <ul>
                  {modalData.duplicates.map((courseId, index) => (
                    <li key={index}>{courseId}</li>
                  ))}
                </ul>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              paddingY="14px"
              paddingX="24px"
              label="Close"
              borderRadius="8px"
              color="white"
              backgroundColor="#FF4E4E"
              onClick={onClose}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={FileImport}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>อัพโหลดทรานสคริป</ModalHeader>
          <ModalBody>
            <Input
              type="file"
              onChange={handleFileChange}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="4px"
            />
          </ModalBody>

          <ModalFooter
            display="flex"
            padding="24px"
            justifyContent="space-between"
            gap="16px"
          >
            <Button
              label="อัพโหลด"
              width="100%"
              onClick={handleFileSubmit}
              isLoading={isPending}
              borderWidth={file === undefined ? 1 : 0}
              borderColor={file === undefined ? "black" : "transparent"}
              isDisabled={file === undefined ? true : false}
              backgroundColor={file === undefined ? "transparent" : "#2ABE0D"}
              color={file === undefined ? "black" : "white"}
            />
            <Button
              label="ยกเลิก"
              width="100%"
              onClick={CloseFileImport}
              backgroundColor="red"
              color="white"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={AddCoure}
        onClose={CloseAddCourse}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>เพิ่มรหัสวิชา</ModalHeader>
          <ModalBody>
            <Box
              display="flex"
              gap="4px"
              flexDirection="column"
            >
              <Box>{`รหัสวิชา (CourseCode)`}</Box>
              <Input
                onChange={handleDipCourseChange}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
              />
            </Box>
          </ModalBody>

          <ModalFooter
            display="flex"
            padding="24px"
            justifyContent="space-between"
            gap="16px"
          >
            <Button
              label="เพิ่ม"
              width="100%"
              onClick={handleSubmit}
              isLoading={isPending}
              isDisabled={dipCourse === "" ? true : false}
              borderWidth={dipCourse === "" ? 1 : 0}
              borderColor={dipCourse === "" ? "black" : "transparent"}
              backgroundColor={dipCourse === "" ? "transparent" : "#2ABE0D"}
              color={dipCourse === "" ? "black" : "white"}
            />
            <Button
              label="ยกเลิก"
              width="100%"
              onClick={CloseAddCourse}
              backgroundColor="red"
              color="white"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={FileImport}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>อัพโหลดทรานสคริป</ModalHeader>
          <ModalBody>
            <Input
              type="file"
              onChange={handleFileChange}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="4px"
            />
          </ModalBody>

          <ModalFooter
            display="flex"
            padding="24px"
            justifyContent="space-between"
            gap="16px"
          >
            <Button
              label="อัพโหลด"
              width="100%"
              onClick={handleFileSubmit}
              isLoading={isPending}
              borderWidth={file === undefined ? 1 : 0}
              borderColor={file === undefined ? "black" : "transparent"}
              isDisabled={file === undefined ? true : false}
              backgroundColor={file === undefined ? "transparent" : "#2ABE0D"}
              color={file === undefined ? "black" : "white"}
            />
            <Button
              label="ยกเลิก"
              width="100%"
              onClick={CloseFileImport}
              backgroundColor="red"
              color="white"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
