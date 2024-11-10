"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"

import useMutateAddDepartment from "@/feature/Department/DepartmentManipulationLanguage/hooks/useMutateAddDepartment"
import useMutateDeleteDepartment from "@/feature/Department/DepartmentManipulationLanguage/hooks/useMutateDeleteDepartment"
import useMutateEditDepartment from "@/feature/Department/DepartmentManipulationLanguage/hooks/useMutateEditDepartment"
import { IDepartmentData } from "@/feature/Department/DepartmentManipulationLanguage/interface/departmentManipulation"
import useGetAllDepartment from "@/feature/Department/GetAllDepartment/hooks/useGetAllDepartment"
import {
  IDepartmentResponseList,
  IGetAllDepartmentResponse
} from "@/feature/Department/GetAllDepartment/interface/getAllDepartment"
import {
  getNextDepartmentData,
  searchDepartmentData
} from "@/feature/Department/SearchDepartment/services/getSearchDepartmentData.service"
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
  useToast
} from "@chakra-ui/react"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiRefreshLine,
  RiSearchFill
} from "@remixicon/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useCallback, useEffect, useState } from "react"

export default function DepartmentManage() {
  const toast = useToast()
  const { getDepartmentData } = useGetAllDepartment()
  const [page, setPage] = useState(0)
  const [departmentData, setNewDepartData] =
    useState<IGetAllDepartmentResponse>()
  const { onEditDepartmentData } = useMutateEditDepartment()
  const [selectDepartmentId, setSelectDepartmentId] = useState<number>(0)
  const { onAddDepartmentData } = useMutateAddDepartment()
  const { onDeleteDepartment } = useMutateDeleteDepartment()
  const [getId, setGetId] = useState<number>(0)
  const currentPage = (departmentData?.page?.number ?? 0) + 1
  const checkValue = () => modalEditData.departmentName !== ""
  const checkAddCourseValue = () => addDepartmentData.departmentName !== ""
  const checkPrevPage = () => {
    if (departmentData) {
      if (departmentData?.page?.number <= 0) {
        return true
      }
      return false
    }
  }
  const checkNextPage = () => {
    if (departmentData) {
      if (departmentData.page.number + 1 >= departmentData.page.totalPages) {
        return true
      }
      return false
    }
  }
  useEffect(() => {
    if (getDepartmentData) {
      setNewDepartData(getDepartmentData)
    }
  }, [getDepartmentData])
  const {
    isOpen: AddDepartment,
    onOpen: OpenAddDepartment,
    onClose: CloseAddDepartment
  } = useDisclosure()
  const {
    isOpen: EditDepartment,
    onOpen: OpenEditDepartment,
    onClose: CloseEditDepartment
  } = useDisclosure()
  const {
    isOpen: DeleteDepartment,
    onOpen: OpenDeleteDepartment,
    onClose: CloseDeleteDepartment
  } = useDisclosure()
  const [modalEditData, setModalEditData] = useState<IDepartmentData>({
    departmentName: ""
  })
  const [modalDeleteData, setModalDeleteData] = useState({
    departmentId: 0,
    departmentName: ""
  })
  const {
    isOpen: SearchDepartment,
    onOpen: OpenSearchDepartment,
    onClose: CloseSearchDepartment
  } = useDisclosure()
  const [addDepartmentData, setAddDepartmentData] = useState<IDepartmentData>({
    departmentName: ""
  })
  const [searchDepart, setSearchCourseData] = useState<IDepartmentData>({
    departmentName: ""
  })

  const handleOpenEditDepartment = (item: IDepartmentResponseList) => {
    setGetId(item.departmentId)
    setModalEditData({
      departmentName: item.departmentName
    })
    OpenEditDepartment()
  }
  const handleAddDepartmentData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setAddDepartmentData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleSubmitAddDepartment = () => {
    const _sendUniCourse = onAddDepartmentData(addDepartmentData).then(() => {
      setAddDepartmentData({
        departmentName: ""
      })
      CloseAddDepartment()
      handleRefresh()
    })
  }

  const handleOnCloseAddDepartment = () => {
    setAddDepartmentData({
      departmentName: ""
    })
    CloseAddDepartment()
  }

  const handleEditDepartmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setModalEditData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleDepartSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setSearchCourseData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleEditSubmit = () => {
    const submit = onEditDepartmentData({
      id: getId,
      departmentName: { departmentName: modalEditData.departmentName }
    }).then(() => {
      CloseEditDepartment()
      handleRefresh()
    })
  }
  const handleOpenDeleteDepartment = (item: IDepartmentResponseList) => {
    setSelectDepartmentId(item.departmentId)
    setModalDeleteData({
      departmentId: item.departmentId,
      departmentName: item.departmentName
    })
    OpenDeleteDepartment()
  }
  const handleDeleteSubmit = () => {
    const data = onDeleteDepartment(selectDepartmentId).then(() => {
      setSelectDepartmentId(0)
      handleRefresh()
      CloseDeleteDepartment()
    })
  }
  const handleDepartSearchData = () => {
    setSearchCourseData({
      departmentName: ""
    })
    CloseSearchDepartment()
  }
  const handleRefresh = async () => {
    await getNextDepartmentData(searchDepart, page).then((newDepartData) => {
      setNewDepartData(newDepartData)
    })
  }
  const handleSearchRefresh = async () => {
    setPage(0)
    setSearchCourseData({
      departmentName: ""
    })
    const getRefreshData = await searchDepartmentData(searchDepart)
    setNewDepartData(getRefreshData)
  }

  const handleDepartSearchSubmit = useCallback(async () => {
    try {
      const searchDeaprtData = await searchDepartmentData(searchDepart)
      if (searchDeaprtData && searchDeaprtData._embedded) {
        setPage(0)
        setNewDepartData(searchDeaprtData)
        CloseSearchDepartment()
      } else {
        toast({
          title: "ไม่มีข้อมูลที่ต้องการ",
          status: "error",
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: "ERROR!",
        status: "error",
        isClosable: true
      })
    }
  }, [CloseSearchDepartment, searchDepart, toast])

  const handleNextPage = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage + 1
      const toastId = "search-toast"

      getNextDepartmentData(searchDepart, newPage).then((newDepartData) => {
        if (newDepartData && newDepartData._embedded) {
          setNewDepartData(newDepartData)
        } else {
          if (toast.isActive(toastId)) {
            toast({
              id: toastId,
              title: "กรุณาลองอีกครั้ง",
              status: "error",
              isClosable: true,
              duration: 3000
            })
          }

          setPage(0)
        }
      })

      return newPage
    })
  }, [searchDepart, toast])

  const handlePrevPage = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage - 1
      const toastId = "search-toast"

      getNextDepartmentData(searchDepart, newPage).then((newDepartData) => {
        if (newDepartData && newDepartData._embedded) {
          setNewDepartData(newDepartData)
        } else {
          if (!toast.isActive(toastId)) {
            toast({
              id: toastId,
              title: "กรุณาลองอีกครั้ง",
              status: "error",
              isClosable: true,
              duration: 3000
            })
          }
          handleDepartSearchSubmit()
          setPage(0)
        }
      })

      return newPage
    })
  }, [handleDepartSearchSubmit, searchDepart, toast])

  console.log(page)
  const columnHelper = createColumnHelper<IDepartmentResponseList>()
  const columns = [
    columnHelper.accessor("departmentName", {
      header: () => (
        <Box whiteSpace="pre-wrap">ชื่อแผนก{"\n"}Department Name</Box>
      ),
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("createdBy", {
      header: () => <Box whiteSpace="pre-wrap">สร้างโดย{"\n"}Created By</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("createdDate", {
      header: () => (
        <Box whiteSpace="pre-wrap">สร้างเมื่อ{"\n"}Create Date</Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),
    columnHelper.accessor("lastModifiedBy", {
      header: () => (
        <Box whiteSpace="pre-wrap">แก้ไขโดย{"\n"}LastModified By</Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),
    columnHelper.accessor("lastModifiedDate", {
      header: () => (
        <Box whiteSpace="pre-wrap">แก้ไขเมื่อ{"\n"}LastModified Date</Box>
      ),
      cell: (info) => {
        return info.getValue()
      }
    }),

    columnHelper.display({
      id: "iconColumn",
      header: () => <Box whiteSpace="pre-wrap">แก้ไข/ลบ{"\n"}Edit/Delete</Box>
    })
  ]
  const table = useReactTable({
    data: getDepartmentData?._embedded?.departmentResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  return (
    <>
      <SideBar id={4} />
      <Box
        minHeight="100vh"
        height="auto"
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
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  gap="24px"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="8px"
                  >
                    <Box
                      as="button"
                      display="flex"
                      width="40px"
                      height="40px"
                      backgroundColor="black"
                      borderRadius="8px"
                      justifyContent="center"
                      alignItems="center"
                      onClick={handleSearchRefresh}
                    >
                      <Box>
                        <RiRefreshLine color="#FFFFFF" />
                      </Box>
                    </Box>
                    <Button
                      leftIcon={<RiSearchFill />}
                      label="ค้นหาชื่อแผนก"
                      backgroundColor="black"
                      color="#FFFFFF"
                      paddingY="14px"
                      paddingX="59px"
                      borderRadius="8px"
                      onClick={OpenSearchDepartment}
                    />
                  </Box>
                  <Button
                    alignSelf="flex-end"
                    label="เพิ่มรายชื่อแผนก"
                    backgroundColor="#2ABE0D"
                    color="#FFFFFF"
                    paddingY="14px"
                    paddingX="79px"
                    borderRadius="8px"
                    onClick={OpenAddDepartment}
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection="row"
                  marginTop="24px"
                  marginBottom="12px"
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    fontWeight={700}
                    fontSize="32px"
                  >
                    จัดการแผนก
                  </Box>
                  <Box
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
                      width="40px"
                      padding="6px"
                      borderWidth={1}
                      borderColor="black"
                      borderRadius={8}
                    >
                      {`${currentPage}/${departmentData?.page.totalPages}`}
                    </Box>
                    <Button
                      label={<RiArrowRightSLine />}
                      isDisabled={checkNextPage()}
                      onClick={handleNextPage}
                    ></Button>
                  </Box>
                </Box>
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
                          return (
                            <Th
                              padding="16px"
                              key={header.id}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Th>
                          )
                        })}
                      </Tr>
                    ))}
                  </Thead>

                  <Tbody>
                    {departmentData &&
                    departmentData._embedded.departmentResponseList.length >
                      0 ? (
                      departmentData._embedded.departmentResponseList.map(
                        (item, index) => (
                          <Tr
                            key={index}
                            paddingY="8px"
                          >
                            <Td>{item.departmentName}</Td>
                            <Td>{item.createdBy}</Td>
                            <Td>{item.createdDate}</Td>
                            <Td>{item.lastModifiedBy}</Td>
                            <Td>{item.lastModifiedDate}</Td>

                            <Box
                              display="flex"
                              flexDirection="row"
                            >
                              <Td>
                                <Box
                                  as="button"
                                  title="แก้ไข"
                                  onClick={() => handleOpenEditDepartment(item)}
                                >
                                  <RiEdit2Fill color="orange" />
                                </Box>
                              </Td>
                              <Td>
                                <Box
                                  as="button"
                                  title="ลบ"
                                  onClick={() =>
                                    handleOpenDeleteDepartment(item)
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
          isOpen={AddDepartment}
          onClose={handleOnCloseAddDepartment}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              เพิ่มรายชื่อแผนก
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="32px"
            >
              <Input
                value={addDepartmentData.departmentName}
                placeholder="ชื่อแผนก"
                onChange={(e) => handleAddDepartmentData(e, "departmentName")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />
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
                backgroundColor={
                  checkAddCourseValue() ? "#2ABE0D" : "transparent"
                }
                isDisabled={!checkAddCourseValue()}
                onClick={handleSubmitAddDepartment}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleOnCloseAddDepartment}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={EditDepartment}
          onClose={CloseEditDepartment}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              แก้ไขชื่อแผนก
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
                  value={modalEditData.departmentName}
                  placeholder="ชื่อแผนก"
                  onChange={(e) =>
                    handleEditDepartmentChange(e, "departmentName")
                  }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
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
                label="ตกลง"
                width="100%"
                backgroundColor={checkValue() ? "#2ABE0D" : "transparent"}
                onClick={handleEditSubmit}
                isDisabled={!checkValue()}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={CloseEditDepartment}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={DeleteDepartment}
          onClose={CloseDeleteDepartment}
        >
          <ModalOverlay />
          <ModalContent
            minWidth="454px"
            minHeight="300px"
            maxWidth="600px"
            width="auto"
            height="auto"
            padding="16px"
          >
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              ลบแผนก
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              color="red"
              fontSize="18px"
              fontWeight={700}
            >
              <Box>ยืนยันที่จะลบแผนกนี้ใช่หรือไม่?</Box>
              <Box>{`** ชื่อแผนก: ${modalDeleteData.departmentName} **`}</Box>
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
                onClick={CloseDeleteDepartment}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={SearchDepartment}
          onClose={CloseSearchDepartment}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              ค้นหาชื่อแผนก
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
                  value={searchDepart.departmentName}
                  placeholder="ชื่อแผนก"
                  onChange={(e) =>
                    handleDepartSearchChange(e, "departmentName")
                  }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
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
                label="ตกลง"
                width="100%"
                backgroundColor="#2ABE0D"
                onClick={handleDepartSearchSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleDepartSearchData}
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
