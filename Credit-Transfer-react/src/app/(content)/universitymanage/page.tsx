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
import useMutateEditUniCourseData from "@/feature/UniversityManage/EditUniCourseData/hooks/useMutateEditUniCourseData"
import useGetAllNewUniCourse from "@/feature/UniversityManage/GetAllUniCourse/hooks/useGetAllNewUniCourse"
import useGetAllUniCourse from "@/feature/UniversityManage/GetAllUniCourse/hooks/useGetAllUniCourse"
import {
  ISearchUniResponse,
  IUniCourseResponse,
  IUniCourseResponseList
} from "@/feature/UniversityManage/GetAllUniCourse/interface/GetAllUniCourse"
import {
  getNextSearchUniCourseData,
  searchUniCourseData,
  uniNextPage
} from "@/feature/UniversityManage/GetAllUniCourse/services/getAllUniCourse.service"
import useMutateSortUniCourseData from "@/feature/UniversityManage/SortUniCourseData/hooks/useMutateSortUniCourseData"
import { TUniKey } from "@/feature/UniversityManage/SortUniCourseData/interface/SortUniCourseData"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
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
  Th,
  Thead,
  Tr,
  useDisclosure,
  Select,
  useToast
} from "@chakra-ui/react"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiFileTextFill,
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

export default function UniversityManage() {
  const toast = useToast()
  const { getUniCourseData } = useGetAllNewUniCourse()
  const [page, setPage] = useState(0)
  const [newUniCourseData, setNewUniCourseData] = useState<IUniCourseResponse>()
  const { getUniCourseDropdown } = useGetCreateUniCourseDropdown()
  const { onEditUniCourseData } = useMutateEditUniCourseData()
  const { categoryCourseData } = useGetCategoryDropdownData()
  const [selectUniCourseId, setSelectUniCourseId] = useState<number>(0)
  const { onAddUniCourseData } = useMutateAddUniCourseData()
  const { onDeleteUniCourse } = useMutateDeleteUniCourseData()
  const { onSortUniCourseData } = useMutateSortUniCourseData()
  const [getId, setGetId] = useState<number>(0)
  const currentPage = (newUniCourseData?.page?.number ?? 0) + 1
  const checkValue = () =>
    modalEditData.courseCategory > 0 && modalEditData.uniCredit > 0
  const checkAddCourseValue = () =>
    addUniCourseData.uniCredit > 0 && addUniCourseData.courseCategory > 0
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
  useEffect(() => {
    if (getUniCourseData) {
      setNewUniCourseData(getUniCourseData)
    }
  }, [getUniCourseData])
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
  const {
    isOpen: SearchUniCourse,
    onOpen: OpenSearchUniCourse,
    onClose: CloseSearchUniCourse
  } = useDisclosure()
  const [addUniCourseData, setAddUniCourseData] =
    useState<IAddUniCourseResponse>({
      uniCourseId: "",
      uniCourseName: "",
      uniCredit: 0,
      preSubject: "",
      courseCategory: 0
    })
  const [searchCourseData, setSearchCourseData] = useState<ISearchUniResponse>({
    uniCourseId: "",
    uniCourseName: "",
    courseCategory: "",
    uniCredit: "",
    preSubject: ""
  })
  const [modalDeleteData, setModalDeleteData] = useState({
    uniCourseId: "",
    uniCourseName: "",
    courseCategory: "",
    uniCredit: "",
    preSubject: ""
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
    const inputValue = e.target.value
    const value =
      field === "uniCredit" && Number(inputValue) > 3 ? "3" : inputValue
    setAddUniCourseData((prevData) => ({
      ...prevData,
      [field]: value
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
      handleRefresh()
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
    const inputValue = e.target.value
    const value =
      field === "uniCredit" && Number(inputValue) > 3 ? "3" : inputValue

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
  const handleUniSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    let value: number | string = e.target.value

    if (field === "uniCredit" && Number(value) > 3) {
      value = 3
    }

    setSearchCourseData((prevData) => ({
      ...prevData,
      [field]: value
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
      CloseEditUniCourse()
      handleRefresh()
    })
  }
  const handleOpenDeleteUniCourse = (item: any) => {
    setSelectUniCourseId(item.id)
    setModalDeleteData({
      uniCourseId: item.uniCourseId,
      uniCourseName: item.uniCourseName,
      courseCategory: item.courseCategory,
      uniCredit: item.uniCredit,
      preSubject: item.preSubject
    })
    OpenDeleteUniCourse()
  }

  const handleDeleteSubmit = () => {
    const data = onDeleteUniCourse(selectUniCourseId).then(() => {
      setSelectUniCourseId(0)
      handleRefresh()
      CloseDeleteUniCourse()
    })
  }
  const handleCloseUniSearchData = () => {
    setSearchCourseData({
      uniCourseId: "",
      uniCourseName: "",
      courseCategory: "",
      uniCredit: "",
      preSubject: ""
    })
    CloseSearchUniCourse()
  }
  // const refreshApiAfterEdit = useCallback(async () => {
  //   try {
  //     const newUniData = await uniNextPage(page) // เรียก API และส่ง page ปัจจุบันไป
  //     setNewUniCourseData(newUniData) // อัปเดตข้อมูลใหม่
  //   } catch (error) {
  //     console.error("Error fetching new data:", error)
  //   }
  // }, [page])
  const handleRefresh = async () => {
    await getNextSearchUniCourseData(searchCourseData, page).then(
      (newDipData) => {
        setNewUniCourseData(newDipData)
      }
    )
  }
  const handleSearchRefresh = async () => {
    setPage(0)
    setSearchCourseData({
      uniCourseId: "",
      uniCourseName: "",
      courseCategory: "",
      uniCredit: "",
      preSubject: ""
    })
    const getRefreshData = await searchUniCourseData(searchCourseData)
    setNewUniCourseData(getRefreshData)
  }

  const handleUniSearchSubmit = useCallback(async () => {
    try {
      const searchUnidata = await searchUniCourseData(searchCourseData)
      if (searchUnidata && searchUnidata._embedded) {
        setPage(0)
        setNewUniCourseData(searchUnidata)
        CloseSearchUniCourse()
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
  }, [CloseSearchUniCourse, searchCourseData, toast])

  const handleNextPage = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage + 1
      const toastId = "search-toast"

      getNextSearchUniCourseData(searchCourseData, newPage).then(
        (newUniData) => {
          if (newUniData && newUniData._embedded) {
            setNewUniCourseData(newUniData)
            setSortConfig({ key: null, direction: "ascending" })
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
            handleUniSearchSubmit()
            setPage(0)
          }
        }
      )

      return newPage
    })
  }, [handleUniSearchSubmit, searchCourseData, toast])

  const handlePrevPage = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage - 1
      const toastId = "search-toast"

      getNextSearchUniCourseData(searchCourseData, newPage).then(
        (newUniData) => {
          if (newUniData && newUniData._embedded) {
            setNewUniCourseData(newUniData)
            setSortConfig({ key: null, direction: "ascending" })
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
            handleUniSearchSubmit()
            setPage(0)
          }
        }
      )

      return newPage
    })
  }, [handleUniSearchSubmit, searchCourseData, toast])

  // const handleNextPage = () => {
  //   setPage((prevPage) => {
  //     const newPage = prevPage + 1

  //     getNextSearchUniCourseData(searchCourseData, newPage).then(
  //       (newUniData) => {
  //         setNewUniCourseData(newUniData)
  //       }
  //     )

  //     return newPage
  //   })
  // }
  // const handlePrevPage = () => {
  //   setPage((prevPage) => {
  //     const newPage = prevPage - 1

  //     getNextSearchUniCourseData(searchCourseData, newPage).then(
  //       (newUniData) => {
  //         setNewUniCourseData(newUniData)
  //       }
  //     )
  //     return newPage
  //   })
  // }
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
    data: getUniCourseData?._embedded?.uniCourseResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  const [sortConfig, setSortConfig] = useState<{
    key: TUniKey | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  const handleSortUniCourseData = useCallback(
    async (key: TUniKey) => {
      let direction: "ascending" | "descending" = "ascending"

      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending"
      }

      if (sortConfig) {
        if (newUniCourseData) {
          const sortedData = await onSortUniCourseData({
            data: newUniCourseData,
            key: key as TUniKey,
            direction: sortConfig.direction === "ascending"
          })
          setNewUniCourseData(sortedData)
        }
      }
      setSortConfig({ key, direction })
    },
    [newUniCourseData, onSortUniCourseData, sortConfig]
  )
  return (
    <>
      {}
      <SideBar id={3} />
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
                      label="ค้นหาวิชา"
                      backgroundColor="black"
                      color="#FFFFFF"
                      paddingY="14px"
                      paddingX="59px"
                      borderRadius="8px"
                      onClick={OpenSearchUniCourse}
                    />
                  </Box>
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
                    จัดการวิชา UTCC
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
                      {`${currentPage}/${newUniCourseData?.page.totalPages}`}
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
                                  handleSortUniCourseData(header.column.id)
                                }
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {isMoreInformaion ? (
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
                                    handleOpenDeleteUniCourse(item)
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
                value={
                  addUniCourseData.uniCredit === 0
                    ? ""
                    : addUniCourseData.uniCredit
                }
                placeholder="หน่วยกิต"
                onChange={(e) => handleAddUniCourseData(e, "uniCredit")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
                type="number"
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
                label="เพิ่ม"
                width="100%"
                backgroundColor={
                  checkAddCourseValue() ? "#2ABE0D" : "transparent"
                }
                isDisabled={!checkAddCourseValue()}
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
                  type="number"
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
                isDisabled={!checkValue()}
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
              ลบวิชา
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
              <Box>ยืนยันที่จะลบวิชานี้ใช่หรือไม่?</Box>
              <Box>{`** รหัสวิชา: ${modalDeleteData.uniCourseId} **`}</Box>
              <Box>{`** ชื่อวิชา: ${modalDeleteData.uniCourseName} **`}</Box>
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
        <Modal
          isOpen={SearchUniCourse}
          onClose={CloseSearchUniCourse}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              ค้นหาวิชา
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
                  value={searchCourseData.uniCourseId}
                  placeholder="รหัสวิชา UTCC"
                  onChange={(e) => handleUniSearchChange(e, "uniCourseId")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Input
                  value={searchCourseData.uniCourseName}
                  placeholder="ชื่อวิชา UTCC"
                  onChange={(e) => handleUniSearchChange(e, "uniCourseName")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  type="number"
                  value={searchCourseData.uniCredit}
                  placeholder="หน่วยกิต UTCC"
                  onChange={(e) => handleUniSearchChange(e, "uniCredit")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={searchCourseData.courseCategory}
                  placeholder="หมวดหมู่"
                  onChange={(e) => handleUniSearchChange(e, "courseCategory")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={searchCourseData.preSubject}
                  placeholder="วิชาก่อนหน้า"
                  onChange={(e) => handleUniSearchChange(e, "preSubject")}
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
                onClick={handleUniSearchSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleCloseUniSearchData}
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
