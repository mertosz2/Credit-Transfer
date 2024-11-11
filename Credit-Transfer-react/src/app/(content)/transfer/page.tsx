"use client"
import Button from "@/components/Button"
import {
  ICreditTransferResponse,
  IDiplomaCourseList,
  IUniversityCourse,
  IFlatDiplomaCourseList,
  TKey
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
  useToast,
  Icon,
  useBreakpointValue
} from "@chakra-ui/react"
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import useTransferable from "@/feature/CreditTransfer/hooks/useTransferable"
import { RiAddFill, RiCheckLine, RiErrorWarningFill } from "@remixicon/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import useSortData from "@/feature/CreditTransfer/hooks/useSortData"
import { flattenData } from "@/util/flatData"
import { getStringAfterUnderscore, isValidNumberInput } from "@/util/string"
import { useRouter } from "next/navigation"
import useCreditTransferStore, {
  selectOnSetCreditTransferData
} from "@/stores/creditTransferStore"
import SideBar from "@/components/SideBar"

export default function Main() {
  const setData = useCreditTransferStore(selectOnSetCreditTransferData)
  const { onUpdateDipCourse } = useGetDipCourseById()
  const { onUploadFile, isPending } = useGetUploadFileCreditTransfer()
  const [dipCourse, setDipCourse] = useState("")
  const toast = useToast()
  const router = useRouter()
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
        uniqueNewItems?: string[]
      }
    | undefined
  >(undefined)

  const [displayData, setDisplayData] = useState<ICreditTransferResponse[]>([])
  const [flatData, setFlatData] = useState<IFlatDiplomaCourseList[]>([])
  const { onSortData } = useSortData()

  const calculateTransferable = useCallback(
    (
      diplomaCourseList: IDiplomaCourseList[],
      universityCourse: IUniversityCourse
    ): boolean => {
      // ตรวจสอบว่ามีหลักสูตรมากกว่าหรือเท่ากับ 2 รายการ
      if (diplomaCourseList.length >= 2) {
        console.log("ตรวจสอบว่ามีหลักสูตรมากกว่าหรือเท่ากับ 2 รายการ")
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
          console.log("เปรียบเทียบ totalDipCredit กับ uniCredit")
          return totalDipCredit >= universityCourse.uniCredit
        } else {
          return false
        }
      } else {
        // ถ้า diplomaCourseList.length < 2 ให้ตรวจสอบ dipCredit และ grade แต่ละรายการ
        console.log(
          "ถ้า diplomaCourseList.length < 2 ให้ตรวจสอบ dipCredit และ grade แต่ละรายการ"
        )
        return diplomaCourseList.some(
          (course) =>
            course.dipCredit >= universityCourse.uniCredit && course.grade >= 2
        )
      }
    },
    []
  )

  const handleSubmit = useCallback(async () => {
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
            title: "รหัสวิชานี้มีอยู่ในรายการแล้ว",
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
        setFlatData(flattenData(newArray))
        console.log("Updated Display Data:", newArray)
      } catch (error) {
        console.error("Failed to update DipCourse:", error)
      }
    }
  }, [CloseAddCourse, dipCourse, displayData, onUpdateDipCourse, toast])

  useEffect(() => {
    setFlatData(flattenData(displayData))
  }, [displayData, setFlatData])
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
            title: "ขนาดไฟล์ไม่ควรเกิน 10 MB.",
            status: "error",
            isClosable: true
          })
          setFile(undefined)
        }
      } else {
        toast({
          title: "เฉพาะไฟล์ PNG, JPG, หรือ PDF ที่ได้รับอนุญาต.",
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
        if (newFile) {
          const newIm = newFile.transferCreditResponseList
          const transferCreditResponseList = displayData || []

          // สร้าง Set ของ dipCourseId ที่มีอยู่ใน displayData
          const existingIds = new Set(
            transferCreditResponseList.flatMap((item) =>
              item.diplomaCourseList.map((course) => course.dipCourseId)
            )
          )
          const uniqueIds = new Set<string>()

          // หาข้อมูลใหม่ที่ไม่มีใน existingIds
          const uniqueNewItems = newIm.filter(
            (item) =>
              !item.diplomaCourseList.some((course) =>
                existingIds.has(course.dipCourseId)
              )
          )
          if (transferCreditResponseList.length > 0) {
            uniqueNewItems.map((item) =>
              item.diplomaCourseList.map((course) =>
                uniqueIds.add(course.dipCourseId)
              )
            )
          }

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
          const uniqueNewItemsArray = Array.from(uniqueIds)

          const newArray = [...transferCreditResponseList, ...uniqueNewItems]
          setDisplayData(newArray)
          setFlatData(flattenData(newArray))
          setModalData({
            founded: newFile.foundedDipCourseIdList,
            notFounded: newFile.notFoundedDipCourseIdList,
            duplicates: duplicateIdsArray,
            uniqueNewItems: uniqueNewItemsArray,
            totalfound: newFile.totalFounded,
            totalnotfound: newFile.totalNotFounded,
            totalcourse: newFile.total
          })

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
    setData(creditTransferData)
    router.push("/reportcredittransfer")

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

  const handleGradeChange = useCallback(
    async (newGrade: number, rowIndex: number) => {
      if (!isValidNumberInput(String(newGrade))) {
        return
      }

      const { universityCourse, dipCourseId } = flatData[rowIndex]
      const existingGroupIndex = displayData.findIndex(
        (item) =>
          item.universityCourse.uniCourseId === universityCourse.uniCourseId &&
          item.diplomaCourseList.some(
            (course) => course.dipCourseId === dipCourseId
          )
      )

      if (existingGroupIndex !== -1) {
        const updatedDiplomaCourseList = displayData[
          existingGroupIndex
        ].diplomaCourseList.map((course) =>
          course.dipCourseId === dipCourseId
            ? { ...course, grade: newGrade }
            : course
        )

        const updatedDisplayData = [...displayData]
        updatedDisplayData[existingGroupIndex] = {
          ...updatedDisplayData[existingGroupIndex],
          diplomaCourseList: updatedDiplomaCourseList,
          transferable: calculateTransferable(
            updatedDiplomaCourseList,
            universityCourse
          )
        }

        const updatedFlatData = [...flatData]
        updatedFlatData[rowIndex] = {
          ...updatedFlatData[rowIndex],
          grade: newGrade,
          transferable: calculateTransferable(
            updatedDiplomaCourseList,
            universityCourse
          )
        }
        setFlatData(updatedFlatData)
        setDisplayData(updatedDisplayData)
      }
    },
    [calculateTransferable, displayData, flatData]
  )

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ICreditTransferResponse | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  const handleSort = useCallback(
    async (key: TKey) => {
      let direction: "ascending" | "descending" = "ascending"

      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending"
      }

      if (sortConfig) {
        const sortedData = await onSortData({
          data: displayData,
          key: key,
          direction: sortConfig.direction === "ascending"
        })
        setDisplayData(sortedData)
        setFlatData(flattenData(sortedData))
      }
      setSortConfig({ key, direction })
    },
    [displayData, onSortData, sortConfig]
  )

  const columnHelper = createColumnHelper<IFlatDiplomaCourseList>()

  const columns = [
    columnHelper.accessor("dipCourseId", {
      header: () => <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("dipCourseName", {
      header: () => (
        <Box whiteSpace="pre-wrap">
          วิชาที่ขอเทียบโอน{"\n"}Course Transferred From
        </Box>
      ),
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("grade", {
      header: () => <Box whiteSpace="pre-wrap">เกรด{"\n"}Grade</Box>,
      cell: (info) => (
        <Input
          width={{ lg: "60px", xl: "60px" }}
          type="number"
          step="0.5"
          fontSize={{ lg: "12px", xl: "16px" }}
          fontWeight={700}
          value={info.getValue() || 0}
          onChange={(e) =>
            handleGradeChange(Number(e.target.value), info.row.index)
          }
        />
      )
    }),
    columnHelper.accessor("dipCredit", {
      header: () => <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("universityCourse.uniCourseId", {
      header: () => <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>,
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    }),
    columnHelper.accessor("universityCourse.uniCourseName", {
      header: () => (
        <Box whiteSpace="pre-wrap">
          วิชาที่เทียบโอนหน่วยกิตได้{"\n"}Transferred Course Equivalents
        </Box>
      ),
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    }),
    columnHelper.accessor("universityCourse.uniCredit", {
      header: () => <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>,
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    }),
    columnHelper.accessor("transferable", {
      header: () => <Box whiteSpace="pre-wrap">สถานะ{"\n"}Status</Box>,
      cell: (info) => {
        return info.row.original.isFirstInGroup ? (
          info.getValue() ? (
            <RiCheckLine color="green" />
          ) : (
            <RiErrorWarningFill color="red" />
          )
        ) : null
      }
    })
  ]
  const tableSize = useBreakpointValue({ lg: "lg", xl: "xl" })
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const renderTable = useMemo(() => {
    return (
      <TableContainer
        sx={{ tableLayout: "auto" }}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 16
        }}
      >
        {tableSize === "lg" ? (
          <Table
            size={{ lg: "sm" }}
            backgroundColor="white"
          >
            <Thead bgColor="#D7D7D7">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isTransferable = header.column.id === "transferable"
                    return (
                      <Th
                        padding="16px"
                        fontWeight={700}
                        fontSize={{
                          lg: "10px"
                        }}
                        cursor={isTransferable ? "not-allowed" : "pointer"}
                        key={header.id}
                        onClick={() => {
                          if (!isTransferable) {
                            handleSort(
                              header.column.id.includes("_")
                                ? (getStringAfterUnderscore(
                                    header.column.id
                                  ) as TKey)
                                : (header.column.id as TKey)
                            )
                          }
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isTransferable ? (
                          <Box height="16px" />
                        ) : sortConfig &&
                          sortConfig.key === header.column.id ? (
                          <Icon
                            as={
                              sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                          />
                        ) : (
                          <Icon as={ChevronDownIcon} />
                        )}
                      </Th>
                    )
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {flatData &&
                flatData.length > 0 &&
                displayData &&
                displayData.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      if (cellIndex >= 4 && !row.original.isFirstInGroup) {
                        return null
                      }
                      return (
                        <Td
                          key={cell.id}
                          fontWeight={700}
                          fontSize={{
                            lg: "11px"
                          }}
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
        ) : (
          <Table
            size={{ xl: "md" }}
            backgroundColor="white"
          >
            <Thead bgColor="#D7D7D7">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isTransferable = header.column.id === "transferable"
                    return (
                      <Th
                        padding="16px"
                        cursor={isTransferable ? "not-allowed" : "pointer"}
                        key={header.id}
                        onClick={() => {
                          if (!isTransferable) {
                            handleSort(
                              header.column.id.includes("_")
                                ? (getStringAfterUnderscore(
                                    header.column.id
                                  ) as TKey)
                                : (header.column.id as TKey)
                            )
                          }
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isTransferable ? (
                          <Box height="16px" />
                        ) : (
                          <Icon
                            as={
                              sortConfig && sortConfig.direction === "ascending"
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                          />
                        )}
                      </Th>
                    )
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {flatData &&
                flatData.length > 0 &&
                displayData &&
                displayData.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell, cellIndex) => {
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
        )}
      </TableContainer>
    )
  }, [displayData, flatData, handleSort, sortConfig, table, tableSize])

  return (
    <>
      <SideBar id={1} />
      <Box
        minHeight={{ lg: "100vh", xl: "100vh" }}
        height="auto"
        width="100%"
        backgroundSize="cover"
        background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
      >
        <Box
          display="flex"
          height="100%"
          padding={{ lg: "16px", xl: "0px" }}
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
              marginTop={{ lg: "100px", xl: "60px" }}
              paddingRight={{ lg: "0px", xl: "120px" }}
              paddingLeft={{ lg: "0px", xl: "340px" }}
            >
              <Box
                display="flex"
                flexDirection="column"
              >
                <Button
                  alignSelf="flex-end"
                  label="อัพโหลดทรานสคริป"
                  backgroundColor="#2E99FC"
                  color="#FFFFFF"
                  paddingY="14px"
                  paddingX="79px"
                  borderRadius="8px"
                  onClick={OpenFileImport}
                />
                <Box
                  display="flex"
                  alignSelf="flex-start"
                  fontWeight={700}
                  fontSize="32px"
                >
                  รายวิชาเทียบโอน หมวดศึกษาทั่วไป
                </Box>
              </Box>
              {/* Table */}
              {renderTable}
              <Box
                as="button"
                onClick={OpenAddCourse}
                borderRadius="16px"
                display="flex"
                width="100%"
                borderColor={"white"}
                padding={{ lg: "8px", xl: "16px" }}
                borderWidth={2}
                borderStyle="dashed"
                justifyContent="center"
                marginTop="24px"
              >
                <Box
                  display="flex"
                  width={{ lg: "16px", xl: "30px" }}
                  height={{ lg: "16px", xl: "30px" }}
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
                marginTop="24px"
              >
                <Button
                  label="ถัดไป"
                  paddingY="14px"
                  paddingX="62px"
                  borderRadius="6px"
                  color={
                    displayData && displayData.length > 0 ? "white" : "black"
                  }
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

                <Box>รหัสวิชาที่มีในระบบ {modalData?.totalfound} วิชา</Box>
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

                <Box>
                  รหัสวิชาที่ไม่มีในระบบ {modalData?.totalnotfound} วิชา
                </Box>
                <Box
                  width="100%"
                  height="1px"
                  backgroundColor="black"
                ></Box>
              </Box>
              {modalData?.uniqueNewItems &&
                modalData.uniqueNewItems.length > 0 && (
                  <Box
                    mb={4}
                    display="flex"
                    gap="16px"
                    flexDirection="column"
                  >
                    <Box fontWeight={700}>รหัสวิชาที่เพิ่ม</Box>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap="8px"
                    >
                      {modalData?.uniqueNewItems.map((courseId, index) => (
                        <Box key={index}>{`"${courseId}"${" "}`}</Box>
                      ))}
                    </Box>
                    <Box
                      width="100%"
                      height="1px"
                      backgroundColor="black"
                    ></Box>
                  </Box>
                )}
              <Box
                display="flex"
                gap="16px"
                flexDirection="column"
              >
                <Box>
                  พบรหัสวิชาในใบทรานสคริปทั้งหมด {modalData?.totalcourse} วิชา
                </Box>
                <Box
                  color="red"
                  fontSize="14px"
                  textAlign="center"
                >
                  *โปรดตรวจสอบว่ารหัสวิชาครบถ้วนตามใบทรานสคริปหรือไม่
                  หากไม่พบท่านสามารถเพิ่มรหัสวิชาได้*
                </Box>
              </Box>
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
                <Box>{`รหัสวิชา (Course Code)`}</Box>
                <Input
                  onChange={handleDipCourseChange}
                  display="flex"
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
    </>
  )
}
