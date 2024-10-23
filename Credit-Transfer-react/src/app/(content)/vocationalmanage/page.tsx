"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"
import useSortData from "@/feature/CreditTransfer/hooks/useSortData"
import { TKey } from "@/feature/CreditTransfer/interface/CreditTransfer"
import useGetAllDipCourse from "@/feature/getAllDipCourse/hooks/useGetAllDipCourse"
import useGetNextDipCourse from "@/feature/getAllDipCourse/hooks/useGetNextDipCourse"
import {
  IDipCourseRespone,
  IDiplomaCourseResponseList
} from "@/feature/getAllDipCourse/interface/getAllDipCourse"
import { getNextDipCourse } from "@/feature/getAllDipCourse/services/getAlldipCourse.service"
import useGetUniCourseDropdownData from "@/feature/UniversityManage/UniCourseDropdownData/hooks/useGetUniCourseDropdownData"
import useMutateAddDipCourse from "@/feature/VocationalMange/AddDipCourseData/hook/useMutateAddDipcourseData"
import { IAddDipCourseResponse } from "@/feature/VocationalMange/AddDipCourseData/interface/AddDipcourseData"
import useMutateDeleteDipCourseData from "@/feature/VocationalMange/DeleteDipCourseData/hooks/useMutateDeleteDipCourseData"
import useGetDropdownDipCourseData from "@/feature/VocationalMange/DropdownDipCourseData/hook/useGetDropDownDipCourseData"
import useMutateEditDipCourseData from "@/feature/VocationalMange/EditDipCourseData/hooks/useMutateEditDipCourseDataById"
import useMutateSortDipCourseData from "@/feature/VocationalMange/SortDipCourseData/hooks/useMutateSortDipCourseData"
import { TDipKey } from "@/feature/VocationalMange/SortDipCourseData/interface/SortDipCourseData"
import { getStringAfterUnderscore } from "@/util/string"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import {
  Box,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
  Select,
  Icon
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
import { useCallback, useEffect, useState } from "react"

export default function VocationalManage() {
  const [page, setPage] = useState(0)
  const [newDipCourseData, setNewDipCourseData] = useState<IDipCourseRespone>()
  const { dropdownUniData } = useGetUniCourseDropdownData()
  const { onEditDipCourseData } = useMutateEditDipCourseData()
  const [selectDipCourseId, setSelectDipCourseId] = useState<number>(0)
  const { dipCourseData } = useGetAllDipCourse()
  const { onAddDipCourseData } = useMutateAddDipCourse()
  const { onDeleteDipCourse } = useMutateDeleteDipCourseData()
  const [getId, setGetId] = useState<number>(0)
  const checkValue = () => modalEditData.uniId > 0
  const currentPage = (newDipCourseData?.page?.number ?? 0) + 1
  const { onSortDipCourseData } = useMutateSortDipCourseData()
  const checkPrevPage = () => {
    if (newDipCourseData) {
      if (newDipCourseData?.page?.number <= 0) {
        return true
      }
      return false
    }
  }
  const checkNextPage = () => {
    if (newDipCourseData) {
      if (
        newDipCourseData.page.number + 1 >=
        newDipCourseData.page.totalPages
      ) {
        return true
      }
      return false
    }
  }

  useEffect(() => {
    if (dipCourseData) {
      setNewDipCourseData(dipCourseData)
    }
  }, [dipCourseData])
  const {
    isOpen: AddDipCourse,
    onOpen: OpenAddDipCourse,
    onClose: CloseAddDipCourse
  } = useDisclosure()
  const {
    isOpen: MoreInfomation,
    onOpen: OpenMoreInfomation,
    onClose: CloseMoreInfomation
  } = useDisclosure()
  const {
    isOpen: EditDipCourse,
    onOpen: OpenEditDipCourse,
    onClose: CloseEditDipCourse
  } = useDisclosure()
  const {
    isOpen: DeleteDipCourse,
    onOpen: OpenDeleteDipCourse,
    onClose: CloseDeleteDipCourse
  } = useDisclosure()
  const [modalData, setModalData] = useState({
    createdDate: "",
    createdBy: "",
    lastModifiedDate: "",
    lastModifiedBy: ""
  })
  const [modalEditData, setModalEditData] = useState({
    dipCourseId: "",
    dipCourseName: "",
    dipCredit: 0,
    uniId: 0
  })
  const [addCourseData, setAddCourseData] = useState<IAddDipCourseResponse>({
    dipCourseId: "",
    dipCourseName: "",
    dipCredit: 0,
    uniId: 0
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
  const handleOpenEditDipCourse = (item: any) => {
    setGetId(item.id)
    setModalEditData({
      dipCourseId: item.dipCourseId,
      dipCourseName: item.dipCourseName,
      dipCredit: item.dipCredit,
      uniId: item.uniId
    })
    OpenEditDipCourse()
  }

  const handleAddDipCourseData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setAddCourseData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleSubmitAddDipCourse = () => {
    const _sentDipCourse = onAddDipCourseData(addCourseData).then(() => {
      setAddCourseData({
        dipCourseId: "",
        dipCourseName: "",
        dipCredit: 0,
        uniId: 0
      })
      CloseAddDipCourse()
      refreshApiAfterEdit()
    })
  }
  const handleOnCloseAddDipCourse = () => {
    setAddCourseData({
      dipCourseId: "",
      dipCourseName: "",
      dipCredit: 0,
      uniId: 0
    })
    CloseAddDipCourse()
  }
  const handleSelectAddDipCourseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAddCourseData((prevData) => ({
      ...prevData,
      uniId: parseInt(e.target.value)
    }))
  }
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const value = e.target.value

    setModalEditData((prevData) => ({
      ...prevData,
      [field]: value // อัปเดต field ของ state ตามที่เลือก
    }))
    console.log(value)
  }

  const handleEditSubmit = () => {
    const _submit = onEditDipCourseData({
      id: getId,
      data: {
        dipCourseId: modalEditData.dipCourseId,
        dipCourseName: modalEditData.dipCourseName,
        dipCredit: modalEditData.dipCredit,
        uniId: modalEditData.uniId
      }
    }).then(() => {
      refreshApiAfterEdit()
      CloseEditDipCourse()
    })
  }
  const handleOpenDeleteDipCourse = (id: number) => {
    setSelectDipCourseId(id)
    OpenDeleteDipCourse()
  }
  const handleDeleteSubmit = () => {
    const _data = onDeleteDipCourse(selectDipCourseId).then(() => {
      setSelectDipCourseId(0)
      refreshApiAfterEdit()
      CloseDeleteDipCourse()
    })
  }

  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1

      getNextDipCourse(newPage).then((newDipData) => {
        setNewDipCourseData(newDipData)
        setSortConfig({ key: null, direction: "ascending" })
      })
      return newPage
    })
    console.log(sortConfig)
  }
  const handlePrevPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage - 1

      getNextDipCourse(newPage).then((newDipData) => {
        setNewDipCourseData(newDipData)
        setSortConfig({ key: null, direction: "ascending" })
      })
      return newPage
    })
    console.log(sortConfig)
  }
  const refreshApiAfterEdit = useCallback(async () => {
    try {
      const newDipData = await getNextDipCourse(page)
      setNewDipCourseData(newDipData)
    } catch (error) {
      console.error("Error fetching new data:", error)
    }
  }, [page])

  const columnHelper = createColumnHelper<IDiplomaCourseResponseList>()
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

    columnHelper.accessor("dipCredit", {
      header: () => <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("uniCourseId", {
      header: () => <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>,
      cell: (info) => {
        return info.getValue()
      }
    }),
    columnHelper.accessor("uniCourseName", {
      header: () => (
        <Box whiteSpace="pre-wrap">
          วิชาที่เทียบโอนหน่วยกิตได้{"\n"}Transferred Course Equivalents
        </Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),
    columnHelper.accessor("uniCredit", {
      header: () => <Box whiteSpace="pre-wrap">หน่วยกิต{"\n"}Credit</Box>,
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
    data: dipCourseData?._embedded?.diplomaCourseResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  const [sortConfig, setSortConfig] = useState<{
    key: TDipKey | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  const handleSortDipCourseData = useCallback(
    async (key: TDipKey) => {
      let direction: "ascending" | "descending" = "ascending"

      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending"
      }

      if (sortConfig) {
        if (newDipCourseData) {
          const sortedData = await onSortDipCourseData({
            data: newDipCourseData,
            key: key as TDipKey,
            direction: sortConfig.direction === "ascending"
          })
          setNewDipCourseData(sortedData)
        }
      }
      setSortConfig({ key, direction })
    },
    [newDipCourseData, onSortDipCourseData, sortConfig]
  )
  return (
    <>
      <SideBar id={2} />
      <Box
        height="100%"
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
                  onClick={OpenAddDipCourse}
                />
                <Box
                  display="flex"
                  alignSelf="flex-start"
                  fontWeight={700}
                  fontSize="32px"
                >
                  จัดการวิชา ปวส
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
                    {`${currentPage}/${newDipCourseData?.page.totalPages}`}
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
                        {headerGroup.headers.map((header) => {
                          const isMoreInformaion =
                            header.column.id === "iconColumn"
                          return (
                            <Th
                              padding="16px"
                              cursor={
                                isMoreInformaion ? "not-allowed" : "pointer"
                              }
                              key={header.id}
                              onClick={() => {
                                if (!isMoreInformaion) {
                                  handleSortDipCourseData(header.column.id)
                                }
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {isMoreInformaion ? (
                                <Box height="16px" />
                              ) : // ตรวจสอบว่า key ของ sortConfig ตรงกับ column.id ก่อนแสดงไอคอน
                              sortConfig &&
                                sortConfig.key === header.column.id ? (
                                <Icon
                                  as={
                                    sortConfig.direction === "ascending"
                                      ? ChevronUpIcon
                                      : ChevronDownIcon
                                  }
                                />
                              ) : (
                                <Icon as={ChevronDownIcon} /> // ไอคอนเริ่มต้น (สามารถเลือกเป็นไอคอนอื่นได้)
                              )}
                            </Th>
                          )
                        })}
                      </Tr>
                    ))}
                  </Thead>

                  <Tbody>
                    {newDipCourseData &&
                    newDipCourseData._embedded.diplomaCourseResponseList
                      .length > 0 ? (
                      newDipCourseData._embedded.diplomaCourseResponseList.map(
                        (item, index) => (
                          <Tr
                            key={index}
                            paddingY="8px"
                          >
                            <Td>{item.dipCourseId}</Td>
                            <Td>{item.dipCourseName}</Td>
                            <Td>{item.dipCredit}</Td>
                            <Td>{item.uniCourseId}</Td>
                            <Td>{item.uniCourseName}</Td>
                            <Td>{item.uniCredit}</Td>
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
                                  onClick={() => handleOpenEditDipCourse(item)}
                                >
                                  <RiEdit2Fill color="orange" />
                                </Box>
                              </Td>
                              <Td>
                                <Box
                                  as="button"
                                  title="ลบ"
                                  onClick={() =>
                                    handleOpenDeleteDipCourse(item.id)
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
          isOpen={AddDipCourse}
          onClose={handleOnCloseAddDipCourse}
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
                placeholder="รหัสวิชา"
                value={addCourseData.dipCourseId}
                onChange={(e) => handleAddDipCourseData(e, "dipCourseId")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />

              <Input
                placeholder="ชื่อวิชา"
                value={addCourseData.dipCourseName}
                onChange={(e) => handleAddDipCourseData(e, "dipCourseName")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />

              <Input
                placeholder="หน่วยกิต"
                value={addCourseData.dipCredit}
                onChange={(e) => handleAddDipCourseData(e, "dipCredit")}
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
                placeholder="วิชามหาวิทยาลัย"
                borderWidth="1px"
                borderColor="black"
                value={addCourseData.uniId}
                onChange={handleSelectAddDipCourseChange}
              >
                {dropdownUniData?.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
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
                onClick={handleSubmitAddDipCourse}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleOnCloseAddDipCourse}
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
          isOpen={EditDipCourse}
          onClose={CloseEditDipCourse}
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
                  value={modalEditData.dipCourseId}
                  placeholder="รหัสวิชา"
                  onChange={(e) => handleEditChange(e, "dipCourseId")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Input
                  value={modalEditData.dipCourseName}
                  placeholder="ชื่อวิชา"
                  onChange={(e) => handleEditChange(e, "dipCourseName")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={modalEditData.dipCredit}
                  placeholder="หน่วยกิต"
                  onChange={(e) => handleEditChange(e, "dipCredit")}
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
                  placeholder="วิชามหาวิทยาลัย"
                  borderWidth="1px"
                  borderColor="black"
                  value={modalEditData.uniId} // เพิ่ม value ของ select ให้แสดงค่าเริ่มต้น
                  onChange={(e) => handleEditChange(e, "uniId")}
                >
                  {dropdownUniData?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
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
                isDisabled={!checkValue()}
                onClick={handleEditSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={CloseEditDipCourse}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={DeleteDipCourse}
          onClose={CloseDeleteDipCourse}
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
                onClick={CloseDeleteDipCourse}
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
