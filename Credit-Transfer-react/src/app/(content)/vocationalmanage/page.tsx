"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"
import useGetAllDipCourse from "@/feature/getAllDipCourse/hooks/useGetAllDipCourse"
import {
  IDipCourseRespone,
  IDiplomaCourseResponseList
} from "@/feature/getAllDipCourse/interface/getAllDipCourse"
import { getNextDipCourse } from "@/feature/getAllDipCourse/services/getAlldipCourse.service"
import useGetUniCourseDropdownData from "@/feature/UniversityManage/UniCourseDropdownData/hooks/useGetUniCourseDropdownData"
import useMutateAddDipCourse from "@/feature/VocationalMange/AddDipCourseData/hook/useMutateAddDipcourseData"
import { IAddDipCourseResponse } from "@/feature/VocationalMange/AddDipCourseData/interface/AddDipcourseData"
import useMutateDeleteDipCourseData from "@/feature/VocationalMange/DeleteDipCourseData/hooks/useMutateDeleteDipCourseData"

import useMutateEditDipCourseData from "@/feature/VocationalMange/EditDipCourseData/hooks/useMutateEditDipCourseDataById"
import useGetAllDipCourseData from "@/feature/VocationalMange/SearchDipCourseData/hooks/useGetAllDipCourseData"
import { ISearchDipResponse } from "@/feature/VocationalMange/SearchDipCourseData/interface/SearchDipCourseData"
import {
  getNextSearchDipCourseData,
  searchDipCourseData
} from "@/feature/VocationalMange/SearchDipCourseData/services/getAllDipCourseData.service"
import useMutateSortDipCourseData from "@/feature/VocationalMange/SortDipCourseData/hooks/useMutateSortDipCourseData"
import { TDipKey } from "@/feature/VocationalMange/SortDipCourseData/interface/SortDipCourseData"
import useProfileStore, { selectProfileData } from "@/stores/profileStore"

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
  Icon,
  useToast
} from "@chakra-ui/react"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiFileTextFill,
  RiRefreshFill,
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

export default function VocationalManage() {
  const toast = useToast()
  const { getAllDipData } = useGetAllDipCourseData()
  const [page, setPage] = useState(0)
  const [newDipCourseData, setNewDipCourseData] = useState<IDipCourseRespone>()
  const { dropdownUniData } = useGetUniCourseDropdownData()
  const { onEditDipCourseData } = useMutateEditDipCourseData()
  const [selectDipCourseId, setSelectDipCourseId] = useState<number>(0)
  const { onAddDipCourseData } = useMutateAddDipCourse()
  const { onDeleteDipCourse } = useMutateDeleteDipCourseData()
  const { onSortDipCourseData } = useMutateSortDipCourseData()
  const [getId, setGetId] = useState<number>(0)
  const checkValue = () =>
    modalEditData.uniId > 0 && modalEditData.dipCredit > 0
  const checkIsEmpty = () => {
    if (searchCourseData) {
      return false
    }
    return true
  }
  const checkAddCourseValue = () =>
    addCourseData.uniId > 0 && addCourseData.dipCredit > 0
  const currentPage = (newDipCourseData?.page?.number ?? 0) + 1

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
    if (getAllDipData) {
      setNewDipCourseData(getAllDipData)
    }
  }, [getAllDipData])
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
  const {
    isOpen: SearchDipCourse,
    onOpen: OpenSearchDipCourse,
    onClose: CloseSearchDipCourse
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
  const [searchCourseData, setSearchCourseData] = useState<ISearchDipResponse>({
    dipCourseId: "",
    dipCourseName: "",
    uniCourseId: "",
    uniCourseName: "",
    dipCredit: ""
  })
  const [modalDeleteData, setModalDeleteData] = useState({
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
    const inputValue = e.target.value
    const value =
      field === "dipCredit" && Number(inputValue) > 3 ? "3" : inputValue
    setAddCourseData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleSelectAddDipCourseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAddCourseData((prevData) => ({
      ...prevData,
      uniId: parseInt(e.target.value)
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
      handleRefresh()
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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const inputValue = e.target.value
    const value =
      field === "dipCredit" && Number(inputValue) > 3 ? "3" : inputValue
    setModalEditData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    let value: number | string = e.target.value

    if (field === "dipCredit" && Number(value) > 3) {
      value = 3
    }

    setSearchCourseData((prevData) => ({
      ...prevData,
      [field]: value
    }))
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
      CloseEditDipCourse()
      handleRefresh()
    })
  }
  const handleOpenDeleteDipCourse = (item: any) => {
    setSelectDipCourseId(item.id)
    setModalDeleteData({
      dipCourseId: item.dipCourseId,
      dipCourseName: item.dipCourseName,
      dipCredit: item.dipCredit,
      uniId: item.uniId
    })
    OpenDeleteDipCourse()
  }
  const handleDeleteSubmit = () => {
    const _data = onDeleteDipCourse(selectDipCourseId).then(() => {
      setSelectDipCourseId(0)
      handleRefresh()
      CloseDeleteDipCourse()
    })
  }

  const handleCloseSearchData = () => {
    setSearchCourseData({
      dipCourseId: "",
      dipCourseName: "",
      dipCredit: "",
      uniCourseId: "",
      uniCourseName: ""
    })
    CloseSearchDipCourse()
  }

  const handleRefresh = () => {
    getNextSearchDipCourseData(searchCourseData, page).then((newDipData) => {
      setNewDipCourseData(newDipData)
    })
  }
  const handleSearchRefresh = useCallback(() => {
    setPage(0)
    setSearchCourseData({
      dipCourseId: "",
      dipCourseName: "",
      uniCourseId: "",
      uniCourseName: "",
      dipCredit: ""
    })
    searchDipCourseData(searchCourseData).then((getRefreshData) => {
      setNewDipCourseData(getRefreshData)
    })
  }, [searchCourseData])

  const handleSearchSubmit = useCallback(async () => {
    try {
      const searchData = await searchDipCourseData(searchCourseData)

      if (searchData && searchData._embedded) {
        setPage(0)
        setNewDipCourseData(searchData)
        CloseSearchDipCourse()
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
  }, [CloseSearchDipCourse, searchCourseData, toast])

  const handleNextPage1 = useCallback(async () => {
    await setPage((prevPage) => {
      const newPage = prevPage + 1
      const toastId = "search-toast"

      getNextSearchDipCourseData(searchCourseData, newPage).then(
        (newDipData) => {
          if (newDipData && newDipData._embedded) {
            setNewDipCourseData(newDipData)
            setSortConfig({ key: null, direction: "ascending" })
          } else {
            if (!toast.isActive(toastId)) {
              toast({
                id: toastId,
                title: "กรุณาลองอีกครั้ง",
                status: "error",
                isClosable: true,
                duration: 1000
              })
            }
            handleSearchSubmit()
            setPage(0)
          }
        }
      )

      return newPage
    })
  }, [handleSearchSubmit, searchCourseData, toast])
  const handlePrevPage1 = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage - 1
      const toastId = "search-toast"

      getNextSearchDipCourseData(searchCourseData, newPage).then(
        (newDipData) => {
          if (newDipData && newDipData._embedded) {
            setNewDipCourseData(newDipData)
            setSortConfig({ key: null, direction: "ascending" })
          } else {
            if (!toast.isActive(toastId)) {
              toast({
                id: toastId,
                title: "กรุณาลองอีกครั้ง",
                status: "error",
                isClosable: true,
                duration: 1000
              })
            }
            handleSearchSubmit()
            setPage(0)
          }
        }
      )

      return newPage
    })
  }, [handleSearchSubmit, searchCourseData, toast])
  // const handleNextPage = () => {
  //   setPage((NextPage) => {
  //     const newPage = NextPage + 1

  //     getNextSearchDipCourseData(searchCourseData, newPage).then(
  //       (newDipData) => {
  //         setNewDipCourseData(newDipData)
  //         setSortConfig({ key: null, direction: "ascending" })

  //         console.log("page", page)
  //         console.log("Newpage", page)
  //       }
  //     )
  //     return newPage
  //   })
  // }

  // const handlePrevPage = () => {
  //   setPage((prevPage) => {
  //     const newPage = prevPage - 1

  //     getNextSearchDipCourseData(searchCourseData, newPage).then(
  //       (newDipData) => {
  //         setNewDipCourseData(newDipData)
  //         setSortConfig({ key: null, direction: "ascending" })
  //         console.log("Newpage", page)
  //         console.log(page)
  //       }
  //     )
  //     return newPage
  //   })
  // }

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
    data: getAllDipData?._embedded?.diplomaCourseResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  return (
    <>
      <SideBar id={2} />
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
                      onClick={OpenSearchDipCourse}
                    />
                  </Box>
                  <Button
                    label="เพิ่มวิชา"
                    backgroundColor="#2ABE0D"
                    color="#FFFFFF"
                    paddingY="14px"
                    paddingX="79px"
                    borderRadius="8px"
                    onClick={OpenAddDipCourse}
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
                    จัดการวิชา ปวส
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="8px"
                  >
                    <Button
                      label={<RiArrowLeftSLine />}
                      isDisabled={checkPrevPage()}
                      onClick={handlePrevPage1}
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
                      {`${currentPage}/${newDipCourseData?.page.totalPages}`}
                    </Box>
                    <Button
                      label={<RiArrowRightSLine />}
                      isDisabled={checkNextPage()}
                      onClick={handleNextPage1}
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
                                    handleOpenDeleteDipCourse(item)
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
                value={
                  addCourseData.dipCredit === 0 ? "" : addCourseData.dipCredit
                }
                onChange={(e) => handleAddDipCourseData(e, "dipCredit")}
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
                label="เพิ่ม"
                width="100%"
                backgroundColor={
                  checkAddCourseValue() ? "#2ABE0D" : "transparent"
                }
                isDisabled={!checkAddCourseValue()}
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
                  type="number"
                />

                <Select
                  display="flex"
                  textAlign="center"
                  placeholder="วิชามหาวิทยาลัย"
                  borderWidth="1px"
                  borderColor="black"
                  value={modalEditData.uniId}
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
              <Box>{`** รหัสวิชา: ${modalDeleteData.dipCourseId} **`}</Box>
              <Box>{`** ชื่อวิชา: ${modalDeleteData.dipCourseName} **`}</Box>
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
        <Modal
          isOpen={SearchDipCourse}
          onClose={CloseSearchDipCourse}
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
                  value={searchCourseData.dipCourseId}
                  placeholder="รหัสวิชา ปวส"
                  onChange={(e) => handleSearchChange(e, "dipCourseId")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Input
                  value={searchCourseData.dipCourseName}
                  placeholder="ชื่อวิชา ปวส"
                  onChange={(e) => handleSearchChange(e, "dipCourseName")}
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
                  value={searchCourseData.dipCredit}
                  placeholder="หน่วยกิต ปวส"
                  onChange={(e) => handleSearchChange(e, "dipCredit")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={searchCourseData.uniCourseId}
                  placeholder="รหัสวิชา UTCC"
                  onChange={(e) => handleSearchChange(e, "uniCourseId")}
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
                  onChange={(e) => handleSearchChange(e, "uniCourseName")}
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
                onClick={handleSearchSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleCloseSearchData}
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
