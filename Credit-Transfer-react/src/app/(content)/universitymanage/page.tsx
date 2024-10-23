"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"
import useSortData from "@/feature/CreditTransfer/hooks/useSortData"
import {
  ICreditTransferResponse,
  IFlatDiplomaCourseList,
  TKey
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import useGetNextDipCourse from "@/feature/getAllDipCourse/hooks/useGetNextDipCourse"
import useGetCreateUniCourseDropdown from "@/feature/UniversityManage/AddUniCourseData/hooks/useGetCreateUniCourseDropdown"

import useMutateAddUniCourseData from "@/feature/UniversityManage/AddUniCourseData/hooks/useMutateAddUniCourseData"
import { IAddUniCourseResponse } from "@/feature/UniversityManage/AddUniCourseData/interface/AddUniCourseData"
import useGetCategoryDropdownData from "@/feature/UniversityManage/CategoryCourseDropdownData/hooks/useGetCategoryDropdownData"
import useMutateDeleteUniCourseData from "@/feature/UniversityManage/DeleteUniCourseData/hooks/useMutateDeleteUniCourseData"
import useGetEditUniCourseDropdown from "@/feature/UniversityManage/EditUniCourseData/hooks/usegetEditUniCourseDropdown"
import useMutateEditUniCourseData from "@/feature/UniversityManage/EditUniCourseData/hooks/useMutateEditUniCourseData"
import useGetAllUniCourse from "@/feature/UniversityManage/GetAllUniCourse/hooks/useGetAllUniCourse"
import {
  IUniCourseResponse,
  IUniCourseResponseList
} from "@/feature/UniversityManage/GetAllUniCourse/interface/GetAllUniCourse"
import { uniNextPage } from "@/feature/UniversityManage/GetAllUniCourse/services/getAllUniCourse.service"
import useGetUniCourseDropdownData from "@/feature/UniversityManage/UniCourseDropdownData/hooks/useGetUniCourseDropdownData"
import {
  Box,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Select
} from "@chakra-ui/react"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiFileTextFill
} from "@remixicon/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useState } from "react"

export default function UniversityManage() {
  const [page, setPage] = useState(0)
  const [newUniCourseData, setNewUniCourseData] =
    useState<IUniCourseResponse | null>(null)
  const checkValue = () => {
    return modalEditData.courseCategory === 0
  }

  const { getUniCourseDropdown } = useGetCreateUniCourseDropdown()
  const { onEditUniCourseData } = useMutateEditUniCourseData()
  const { categoryCourseData } = useGetCategoryDropdownData()
  const [selectUniCourseId, setSelectUniCourseId] = useState<number>(0)
  const { uniCourseData, onUniCourseDataRefetch } = useGetAllUniCourse()
  const { onAddUniCourseData } = useMutateAddUniCourseData()
  const { onDeleteUniCourse } = useMutateDeleteUniCourseData()
  const [getId, setGetId] = useState<number>(0)
  const currentPage = (newUniCourseData?.page?.number ?? 0) + 1
  const checkPrevPage = () => {
    if (newUniCourseData) {
      if (newUniCourseData?.page?.number <= 0) {
        return true
      }
      return false
    }
  }
  const checkNextPage = () => {
    if (newUniCourseData) {
      if (
        newUniCourseData.page.number + 1 >=
        newUniCourseData.page.totalPages
      ) {
        return true
      }
      return false
    }
  }
  const updateUniCourseData = useCallback(() => {
    if (uniCourseData) {
      setNewUniCourseData(uniCourseData)
    }
  }, [uniCourseData])

  useEffect(() => {
    updateUniCourseData()
  }, [updateUniCourseData])
  const {
    isOpen: AddUniCourse,
    onOpen: OpenAddUniCourse,
    onClose: CloseAddUniCourse
  } = useDisclosure()
  const {
    isOpen: MoreInfomation,
    onOpen: OpenMoreInfomation,
    onClose: CloseMoreInfomation
  } = useDisclosure()
  const {
    isOpen: EditUniCourse,
    onOpen: OpenEditUniCourse,
    onClose: CloseEditUniCourse
  } = useDisclosure()
  const {
    isOpen: DeleteUniCourse,
    onOpen: OpenDeleteUniCourse,
    onClose: CloseDeleteUniCourse
  } = useDisclosure()
  const [modalData, setModalData] = useState({
    createdDate: "",
    createdBy: "",
    lastModifiedDate: "",
    lastModifiedBy: ""
  })
  const [modalEditData, setModalEditData] = useState({
    uniCourseId: "",
    uniCourseName: "",
    uniCredit: 0,
    preSubject: "",
    courseCategory: 0
  })
  const [addUniCourseData, setAddUniCourseData] =
    useState<IAddUniCourseResponse>({
      uniCourseId: "",
      uniCourseName: "",
      uniCredit: 0,
      preSubject: "",
      courseCategory: 0
    })

  const handleOpenMoreInformaion = (item: any): void => {
    setModalData({
      createdDate: item.createdDate,
      createdBy: item.createdBy,
      lastModifiedDate: item.lastModifiedDate,
      lastModifiedBy: item.lastModifiedBy
    })
    OpenMoreInfomation()
  }
  const handleOpenEditUniCourse = (item: any) => {
    setGetId(item.uniId)
    setModalEditData({
      uniCourseId: item.uniCourseId,
      uniCourseName: item.uniCourseName,
      uniCredit: item.uniCredit,
      preSubject: item.preSubject,
      courseCategory: item.id
    })
    OpenEditUniCourse()
  }

  const handleAddUniCourseData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setAddUniCourseData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleAddourseCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = Number(e.target.value)
    setAddUniCourseData((prevData) => ({
      ...prevData,
      courseCategory: value
    }))
  }
  const handleAddPreSubjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = e.target.value
    setAddUniCourseData((prevData) => ({
      ...prevData,
      preSubject: value
    }))
  }
  const handleSubmitAddUniCourse = () => {
    const _sendUniCourse = onAddUniCourseData(addUniCourseData).then(() => {
      setAddUniCourseData({
        uniCourseId: "",
        uniCourseName: "",
        uniCredit: 0,
        preSubject: "",
        courseCategory: 0
      })
      CloseAddUniCourse()
      refreshApiAfterEdit()
    })
  }
  const handleOnCloseAddUniCourse = () => {
    setAddUniCourseData({
      uniCourseId: "",
      uniCourseName: "",
      uniCredit: 0,
      preSubject: "",
      courseCategory: 0
    })
    CloseAddUniCourse()
  }

  const handleEditUniCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const value = e.target.value

    setModalEditData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleEditCourseCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = Number(e.target.value)
    setModalEditData((prevData) => ({
      ...prevData,
      courseCategory: value
    }))
  }
  const handleEditPreSubjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = e.target.value
    setModalEditData((prevData) => ({
      ...prevData,
      preSubject: value
    }))
  }

  const handleEditSubmit = () => {
    const submit = onEditUniCourseData({
      id: getId,
      data: {
        uniCourseId: modalEditData.uniCourseId,
        uniCourseName: modalEditData.uniCourseName,
        uniCredit: modalEditData.uniCredit,
        preSubject: modalEditData.preSubject,
        courseCategory: modalEditData.courseCategory
      }
    }).then(() => {
      onUniCourseDataRefetch()
      CloseEditUniCourse()
      refreshApiAfterEdit()
    })
  }
  const handleOpenDeleteUniCourse = (id: number) => {
    setSelectUniCourseId(id)
    OpenDeleteUniCourse()
  }
  const handleDeleteSubmit = () => {
    const data = onDeleteUniCourse(selectUniCourseId).then(() => {
      setSelectUniCourseId(0)
      refreshApiAfterEdit()
      CloseDeleteUniCourse()
    })
  }

  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1

      uniNextPage(newPage).then((newUniData) => {
        setNewUniCourseData(newUniData)
      })

      return newPage
    })
  }
  const handlePrevPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage - 1

      uniNextPage(newPage).then((newUniData) => {
        setNewUniCourseData(newUniData)
      })

      return newPage
    })
  }
  const refreshApiAfterEdit = useCallback(async () => {
    try {
      const newUniData = await uniNextPage(page) // เรียก API และส่ง page ปัจจุบันไป
      setNewUniCourseData(newUniData) // อัปเดตข้อมูลใหม่
    } catch (error) {
      console.error("Error fetching new data:", error)
    }
  }, [page])

  const columnHelper = createColumnHelper<IUniCourseResponseList>()
  const columns = [
    columnHelper.accessor("uniCourseId", {
      header: () => <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("uniCourseName", {
      header: () => <Box whiteSpace="pre-wrap">ชื่อวิชา{"\n"}Course Name</Box>,
      cell: (info) => info.getValue()
    }),

    columnHelper.accessor("uniCredit", {
      header: () => <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("courseCategory", {
      header: () => (
        <Box whiteSpace="pre-wrap">หมวดหมู่วิชา{"\n"}Course Category</Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),
    columnHelper.accessor("preSubject", {
      header: () => (
        <Box whiteSpace="pre-wrap">วิชาก่อนหน้า{"\n"}PreSubject</Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),

    columnHelper.display({
      id: "iconColumn",
      header: () => (
        <Box whiteSpace="pre-wrap">
          รายละเอียดเพิ่มเติม{"\n"}More Information
        </Box>
      )
    })
  ]
  const table = useReactTable({
    data: uniCourseData?._embedded?.uniCourseResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IUniCourseResponseList | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  return (
    <>
      <SideBar id={3} />
      <Box
        height="100vh"
        backgroundSize="cover"
        background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
      >
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
              paddingRight="120px"
              paddingLeft="340px"
            >
              <Box
                display="flex"
                flexDirection="column"
              >
                <Button
                  alignSelf="flex-end"
                  label="เพิ่มวิชา"
                  backgroundColor="#2ABE0D"
                  color="#FFFFFF"
                  paddingY="14px"
                  paddingX="79px"
                  borderRadius="8px"
                  onClick={OpenAddUniCourse}
                />
                <Box
                  display="flex"
                  alignSelf="flex-start"
                  fontWeight={700}
                  fontSize="32px"
                >
                  จัดการวิชา UTCC
                </Box>
                {/* <Box
                  display="flex"
                  flexDirection="row"
                  gap="8px"
                >
                  <Button
                    label={<RiArrowLeftSLine />}
                    isDisabled={checkPrevPage()}
                    onClick={handlePrevPage}
                  ></Button>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding="6px"
                    borderWidth={1}
                    borderColor="black"
                    borderRadius={8}
                  >
                    {`${currentPage}/${newUniCourseData?.page.totalPages}`}
                  </Box>
                  <Button
                    label={<RiArrowRightSLine />}
                    isDisabled={checkNextPage()}
                    onClick={handleNextPage}
                  ></Button>
                </Box> */}
              </Box>
              <TableContainer
                sx={{ tableLayout: "auto" }}
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  borderTopRightRadius: 16,
                  borderTopLeftRadius: 16
                }}
              >
                <Table
                  size="md"
                  backgroundColor="white"
                >
                  <Thead bgColor="#D7D7D7">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            padding="16px"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </Thead>

                  <Tbody>
                    {newUniCourseData &&
                    newUniCourseData._embedded.uniCourseResponseList.length >
                      0 ? (
                      newUniCourseData._embedded.uniCourseResponseList.map(
                        (item, index) => (
                          <Tr
                            key={index}
                            paddingY="8px"
                          >
                            <Td>{item.uniCourseId}</Td>
                            <Td>{item.uniCourseName}</Td>
                            <Td>{item.uniCredit}</Td>
                            <Td>{item.courseCategory}</Td>
                            <Td>{item.preSubject}</Td>

                            <Box
                              display="flex"
                              flexDirection="row"
                            >
                              <Td>
                                <Box
                                  as="button"
                                  title="รายละเอียดเพิ่มเติม"
                                  onClick={() => handleOpenMoreInformaion(item)}
                                >
                                  <RiFileTextFill color="gray" />
                                </Box>
                              </Td>
                              <Td>
                                <Box
                                  as="button"
                                  title="แก้ไข"
                                  onClick={() => handleOpenEditUniCourse(item)}
                                >
                                  <RiEdit2Fill color="orange" />
                                </Box>
                              </Td>
                              <Td>
                                <Box
                                  as="button"
                                  title="ลบ"
                                  onClick={() =>
                                    handleOpenDeleteUniCourse(item.uniId)
                                  }
                                >
                                  <RiDeleteBin2Fill color="red" />
                                </Box>
                              </Td>
                            </Box>
                          </Tr>
                        )
                      )
                    ) : (
                      <Tr>
                        <Td
                          colSpan={6}
                          textAlign="center"
                        >
                          No data available
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
        <Modal
          isOpen={AddUniCourse}
          onClose={handleOnCloseAddUniCourse}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              เพิ่มวิชา
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="32px"
            >
              <Input
                value={addUniCourseData.uniCourseId}
                placeholder="รหัสวิชา"
                onChange={(e) => handleAddUniCourseData(e, "uniCourseId")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />

              <Input
                value={addUniCourseData.uniCourseName}
                placeholder="ชื่อวิชา"
                onChange={(e) => handleAddUniCourseData(e, "uniCourseName")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />
              <Input
                value={addUniCourseData.uniCredit}
                placeholder="หน่วยกิต"
                onChange={(e) => handleAddUniCourseData(e, "uniCredit")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />

              <Select
                display="flex"
                textAlign="center"
                placeholder="หมวดหมู่วิชา"
                borderWidth="1px"
                borderColor="black"
                onChange={(e) =>
                  handleAddourseCategoryChange(e, "courseCategoty")
                }
              >
                {categoryCourseData?.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                ))}
              </Select>
              <Select
                display="flex"
                textAlign="center"
                placeholder="วิชาก่อนหน้า"
                borderWidth="1px"
                borderColor="black"
                onChange={(e) => handleAddPreSubjectChange(e, "preSubject")}
              >
                {getUniCourseDropdown?.map((item) => (
                  <option
                    key={item.id}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </Select>
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
                onClick={handleSubmitAddUniCourse}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleOnCloseAddUniCourse}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={MoreInfomation}
          onClose={CloseMoreInfomation}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              รายละเอียดเพิ่มเติม
            </ModalHeader>
            <ModalBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="32px"
              >
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding="12px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                  borderRadius="8px"
                >
                  สร้างเมื่อ {modalData.createdDate}
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding="12px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                  borderRadius="8px"
                >
                  สร้างโดย {modalData.createdBy}
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding="12px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                  borderRadius="8px"
                >
                  แก้ไขเมื่อ {modalData.lastModifiedDate}
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding="12px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                  borderRadius="8px"
                >
                  แก้ไขโดย {modalData.lastModifiedBy}
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
                onClick={CloseMoreInfomation}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={EditUniCourse}
          onClose={CloseEditUniCourse}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              แก้ไขวิชา
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="16px"
            >
              <Box
                display="flex"
                height="100%"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="32px"
              >
                <Input
                  value={modalEditData.uniCourseId}
                  placeholder="รหัสวิชา"
                  onChange={(e) => handleEditUniCourseChange(e, "uniCourseId")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Input
                  value={modalEditData.uniCourseName}
                  placeholder="ชื่อวิชา"
                  onChange={(e) =>
                    handleEditUniCourseChange(e, "uniCourseName")
                  }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={modalEditData.uniCredit}
                  placeholder="หน่วยกิต"
                  onChange={(e) => handleEditUniCourseChange(e, "uniCredit")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Select
                  display="flex"
                  textAlign="center"
                  placeholder="หมวดหมู่วิชา"
                  borderWidth="1px"
                  borderColor="black"
                  onChange={(e) =>
                    handleEditCourseCategoryChange(e, "courseCategoty")
                  }
                >
                  {categoryCourseData?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.label}
                    </option>
                  ))}
                </Select>
                <Select
                  display="flex"
                  textAlign="center"
                  placeholder="วิชาก่อนหน้า"
                  borderWidth="1px"
                  borderColor="black"
                  onChange={(e) => handleEditPreSubjectChange(e, "preSubject")}
                >
                  {getUniCourseDropdown?.map((item) => (
                    <option
                      key={item.id}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </ModalBody>

            <ModalFooter
              display="flex"
              padding="24px"
              justifyContent="space-between"
              gap="16px"
            >
              <Button
                label="ตกลง"
                width="100%"
                backgroundColor={checkValue() ? "#2ABE0D" : "transparent"}
                onClick={handleEditSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={CloseEditUniCourse}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={DeleteUniCourse}
          onClose={CloseDeleteUniCourse}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              ลบวิชา
            </ModalHeader>
            <ModalBody
              display="flex"
              justifyContent="center"
              color="red"
              fontSize="18px"
              fontWeight={700}
            >
              * ยืนยันที่จะลบวิชาใช่หรือไม่? *
            </ModalBody>
            <ModalFooter
              display="flex"
              padding="24px"
              justifyContent="space-between"
              gap="16px"
            >
              <Button
                label="ตกลง"
                width="100%"
                onClick={handleDeleteSubmit}
                backgroundColor="#2ABE0D"
                color="white"
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={CloseDeleteUniCourse}
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
