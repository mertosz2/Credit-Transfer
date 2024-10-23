"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"
import useSortData from "@/feature/CreditTransfer/hooks/useSortData"
import { TKey } from "@/feature/CreditTransfer/interface/CreditTransfer"
import useGetAllUserData from "@/feature/ManageAccount/AllUserData/hooks/useGetAllUserData"
import {
  IAllUserResponse,
  IUsersResponseList
} from "@/feature/ManageAccount/AllUserData/interface/AllUserData"
import useMutateCreateUser from "@/feature/ManageAccount/CreateUser/hooks/useMutateCreateUser"
import { ICreateUserResponse } from "@/feature/ManageAccount/CreateUser/interface/CreateUser"
import useMutateDeleteUserData from "@/feature/ManageAccount/DeleteUserData/hooks/useMutateDeleteUserData"
import useMutateEditUserData from "@/feature/ManageAccount/EditUserData/hooks/useMutateEditUserData"
import useGetCreateUniCourseDropdown from "@/feature/UniversityManage/AddUniCourseData/hooks/useGetCreateUniCourseDropdown"

import useGetCategoryDropdownData from "@/feature/UniversityManage/CategoryCourseDropdownData/hooks/useGetCategoryDropdownData"
import useMutateEditUniCourseData from "@/feature/UniversityManage/EditUniCourseData/hooks/useMutateEditUniCourseData"

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
import { getNextUser } from "@/feature/ManageAccount/AllUserData/services/allUserData.service"
import useGetRoleDorpdownData from "@/feature/ManageAccount/RoleDropdownData/hooks/useGetRoleDropdownData"

export default function ManageAccount() {
  const [page, setPage] = useState(0)
  const [newAllUserData, setnewAllUserData] = useState<IAllUserResponse | null>(
    null
  )
  const checkValue = () => {
    return modalEditData.role === 0
  }
  const { roleDropdown } = useGetRoleDorpdownData()
  const { onEditUserData } = useMutateEditUserData()
  const [selectUniCourseId, setSelectUniCourseId] = useState<number>(0)
  const { getAllUserData } = useGetAllUserData()
  const { onCreateUser } = useMutateCreateUser()
  const { onDeleteUserData } = useMutateDeleteUserData()
  const [getId, setGetId] = useState<number>(0)
  const currentPage = (newAllUserData?.page?.number ?? 0) + 1
  const checkPrevPage = () => {
    if (newAllUserData) {
      if (newAllUserData?.page?.number <= 0) {
        return true
      }
      return false
    }
  }
  const checkNextPage = () => {
    if (newAllUserData) {
      if (newAllUserData.page.number + 1 >= newAllUserData.page.totalPages) {
        return true
      }
      return false
    }
  }
  const updateUserCourseData = useCallback(() => {
    if (getAllUserData) {
      setnewAllUserData(getAllUserData)
    }
  }, [getAllUserData])

  useEffect(() => {
    updateUserCourseData()
  }, [updateUserCourseData])
  const {
    isOpen: CreateUser,
    onOpen: OpenCreateUser,
    onClose: CloseCreateUser
  } = useDisclosure()
  const {
    isOpen: EditUserData,
    onOpen: OpenEditUserData,
    onClose: CloseEditUserData
  } = useDisclosure()
  const {
    isOpen: DeleteUser,
    onOpen: OpenDeleteUser,
    onClose: CloseDeleteUser
  } = useDisclosure()
  const [modalEditData, setModalEditData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: 0
  })
  const [CreateUserData, setCreateUserData] = useState<ICreateUserResponse>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: 0
  })

  const handleOpenEditUserData = (item: any) => {
    setGetId(item.uniId)
    setModalEditData({
      username: item.username,
      password: item.password,
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      role: item.role
    })
    OpenEditUserData()
  }

  const handleCreateUserData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setCreateUserData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handleSelectRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = Number(e.target.value)
    setCreateUserData((prevData) => ({
      ...prevData,
      role: value
    }))
  }
  const handleSubmitAddUniCourse = () => {
    const _sendUniCourse = onCreateUser(CreateUserData).then(() => {
      setCreateUserData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: 0
      })
      CloseCreateUser()
      refreshApiAfterEdit()
    })
  }
  const handleOnCloseCreateUser = () => {
    setCreateUserData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: 0
    })
    CloseCreateUser()
  }

  const handleEditUserDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const value = e.target.value

    setModalEditData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleSelectEditRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    _p0: string
  ) => {
    const value = Number(e.target.value)
    setModalEditData((prevData) => ({
      ...prevData,
      courseCategory: value
    }))
  }

  const handleEditSubmit = () => {
    const submit = onEditUserData({
      id: getId,
      data: {
        username: modalEditData.username,
        password: modalEditData.password,
        firstName: modalEditData.firstName,
        lastName: modalEditData.lastName,
        phone: modalEditData.phone,
        role: modalEditData.role
      }
    }).then(() => {
      CloseEditUserData()
      refreshApiAfterEdit()
    })
  }
  const handleOpenDeleteUser = (id: number) => {
    setSelectUniCourseId(id)
    OpenDeleteUser()
  }
  const handleDeleteSubmit = () => {
    const data = onDeleteUserData(selectUniCourseId).then(() => {
      setSelectUniCourseId(0)
      refreshApiAfterEdit()
      CloseDeleteUser()
    })
  }

  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1

      getNextUser(newPage).then((newUniData) => {
        setnewAllUserData(newUniData)
      })

      return newPage
    })
  }
  const handlePrevPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage - 1

      getNextUser(newPage).then((newUniData) => {
        setnewAllUserData(newUniData)
      })

      return newPage
    })
  }
  const refreshApiAfterEdit = useCallback(async () => {
    try {
      const newUniData = await getNextUser(page)
      setnewAllUserData(newUniData)
    } catch (error) {
      console.error("Error fetching new data:", error)
    }
  }, [page])

  const columnHelper = createColumnHelper<IUsersResponseList>()
  const columns = [
    columnHelper.accessor("username", {
      header: () => <Box whiteSpace="pre-wrap">ชื่อ{"\n"}Name</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("fullName", {
      header: () => <Box whiteSpace="pre-wrap">ชื่อผู้ใช้{"\n"}UserName</Box>,
      cell: (info) => info.getValue()
    }),

    columnHelper.accessor("phone", {
      header: () => <Box whiteSpace="pre-wrap">เบอร์โทรศัพท์{"\n"}Phone</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("role", {
      header: () => <Box whiteSpace="pre-wrap">ตำแหน่ง{"\n"}Role</Box>,
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
    data: newAllUserData?._embedded.usersResponseList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IAllUserResponse | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  return (
    <>
      <SideBar id={4} />
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
                  label="เพิ่มบัญชี"
                  backgroundColor="#2ABE0D"
                  color="#FFFFFF"
                  paddingY="14px"
                  paddingX="79px"
                  borderRadius="8px"
                  onClick={OpenCreateUser}
                />
                <Box
                  display="flex"
                  alignSelf="flex-start"
                  fontWeight={700}
                  fontSize="32px"
                >
                  จัดการบัญชี
                </Box>
                {/* <Box function nextpage
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
                    {`${currentPage}/${newAllUserData?.page.totalPages}`}
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
                    {newAllUserData &&
                    newAllUserData?._embedded?.usersResponseList.length > 0 ? (
                      newAllUserData._embedded.usersResponseList.map(
                        (item, index) => (
                          <Tr
                            key={index}
                            paddingY="8px"
                          >
                            <Td>{item.fullName}</Td>
                            <Td>{item.username}</Td>
                            <Td>{item.phone}</Td>
                            <Td>{item.role}</Td>

                            <Box
                              display="flex"
                              flexDirection="row"
                            >
                              <Td>
                                <Box
                                  as="button"
                                  title="แก้ไข"
                                  onClick={() => handleOpenEditUserData(item)}
                                >
                                  <RiEdit2Fill color="orange" />
                                </Box>
                              </Td>
                              <Td>
                                <Box
                                  as="button"
                                  title="ลบ"
                                  onClick={() =>
                                    handleOpenDeleteUser(item.userId)
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
          isOpen={CreateUser}
          onClose={handleOnCloseCreateUser}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="center"
              fontSize="24px"
            >
              เพิ่มบัญชี
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="32px"
            >
              <Input
                value={CreateUserData.username}
                placeholder="ชื่อผู้ใช้"
                onChange={(e) => handleCreateUserData(e, "username")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />

              <Input
                value={CreateUserData.password}
                placeholder="รหัสผ่าน"
                onChange={(e) => handleCreateUserData(e, "password")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />
              <Input
                value={CreateUserData.firstName}
                placeholder="ชื่อจริง"
                onChange={(e) => handleCreateUserData(e, "firstName")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />
              <Input
                value={CreateUserData.lastName}
                placeholder="นามสกุล"
                onChange={(e) => handleCreateUserData(e, "lastName")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="4px"
                textAlign="center"
                borderWidth="1px"
                borderColor="black"
              />
              <Input
                value={CreateUserData.phone}
                placeholder="เบอร์โทรศัพท์"
                onChange={(e) => handleCreateUserData(e, "phone")}
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
                placeholder="ตำแหน่ง"
                borderWidth="1px"
                borderColor="black"
                onChange={(e) => handleSelectRoleChange(e, "role")}
              >
                {roleDropdown?.map((item) => (
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
                onClick={handleSubmitAddUniCourse}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={handleOnCloseCreateUser}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={EditUserData}
          onClose={CloseEditUserData}
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
                  value={modalEditData.username}
                  placeholder="ชื่อผู้ใช้"
                  onChange={(e) => handleEditUserDataChange(e, "username")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />

                <Input
                  value={modalEditData.password}
                  placeholder="รหัสผ่าน"
                  onChange={(e) => handleEditUserDataChange(e, "password")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={modalEditData.firstName}
                  placeholder="ชื่อจริง"
                  onChange={(e) => handleEditUserDataChange(e, "firstName")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={modalEditData.lastName}
                  placeholder="นามสกุล"
                  onChange={(e) => handleEditUserDataChange(e, "lastName")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="4px"
                  textAlign="center"
                  borderWidth="1px"
                  borderColor="black"
                />
                <Input
                  value={modalEditData.phone}
                  placeholder="เบอร์โทรศัพท์"
                  onChange={(e) => handleEditUserDataChange(e, "phone")}
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
                  placeholder="ตำแหน่ง"
                  borderWidth="1px"
                  borderColor="black"
                  onChange={(e) => handleSelectEditRoleChange(e, "role")}
                >
                  {roleDropdown?.map((item) => (
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
                onClick={handleEditSubmit}
              />
              <Button
                label="ยกเลิก"
                width="100%"
                onClick={CloseEditUserData}
                backgroundColor="red"
                color="white"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={DeleteUser}
          onClose={CloseDeleteUser}
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
                onClick={CloseDeleteUser}
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
