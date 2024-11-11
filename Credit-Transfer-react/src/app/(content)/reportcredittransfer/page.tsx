"use client"
import Button from "@/components/Button"
import SideBar from "@/components/SideBar"
import {
  ICreditTransferResponse,
  IFlatDiplomaCourseList
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import useGetDownloadData from "@/feature/DownloadCreditTransferData/hooks/useGetDownloadData"
import useCreditTransferStore, {
  selectCreditTransferData
} from "@/stores/creditTransferStore"
import { flattenData } from "@/util/flatData"
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useEffect, useState } from "react"

export default function Report() {
  // const columnHelper = createColumnHelper<IDataSection>()
  const columnHelper = createColumnHelper<IFlatDiplomaCourseList>()
  const data = useCreditTransferStore(selectCreditTransferData)
  const [flatData, setFlatData] = useState<IFlatDiplomaCourseList[]>([])
  const [flatData2, setFlatData2] = useState<IFlatDiplomaCourseList[]>([])
  const [flatData3, setFlatData3] = useState<IFlatDiplomaCourseList[]>([])
  const { onDownload } = useGetDownloadData()
  const [downloadData, setDownloadData] = useState<ICreditTransferResponse[]>()

  useEffect(() => {
    if (data) {
      const firstArray = data?.firstSectionList || []
      const secondArray = data?.secondSectionList || []
      const thirdArray = data?.thirdSectionList || []
      setFlatData(flattenData(firstArray))
      setFlatData2(flattenData(secondArray))
      setFlatData3(flattenData(thirdArray))
      const combinedArray: ICreditTransferResponse[] = [
        ...firstArray,
        ...secondArray,
        ...thirdArray
      ]
      setDownloadData(combinedArray)
    }
  }, [data]) //

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
      cell: (info) => info.getValue()
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
    })
  ]
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  const table2 = useReactTable({
    data: flatData2,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const table3 = useReactTable({
    data: flatData3,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const handleDownload = async () => {
    if (downloadData) {
      const blob = await onDownload(downloadData)

      // สร้าง link ที่เป็น binary (blob)
      const url = window.URL.createObjectURL(blob)
      // สร้าง element เป็น tag <a></a>
      const link = document.createElement("a")
      // ใส่ href ให้ <a></a> ---> <a href={url}/>
      link.href = url
      // ใส่ download ให้ <a></a> ---> <a download="credit-transfer.xlsx"/>
      link.setAttribute("download", "credit-transfer.xlsx")
      // ใส่ที่สร้าง tag a มาไปใน <body></body>
      document.body.appendChild(link)
      // ตัวอย่าง
      // <a
      //   href="blob:http://localhost:3000/deadf122-faa6-4d36-8240-77b57b295fc9"
      //   download="credit-transfer.pdf"
      // >
      //   Download
      // </a>
      // ทำให้มันกด
      link.click()
      document.body.removeChild(link)
    }
  }
  const tableSize = useBreakpointValue({ lg: "lg", xl: "xl" })
  return (
    <>
      <SideBar id={0} />
      <Box
        minHeight={{ lg: "100vh", xl: "100vh" }}
        width="100%"
        backgroundSize="cover"
        background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
      >
        <Box
          width="100%"
          height="100%"
          paddingRight={{ lg: "16px", xl: "120px" }}
          paddingLeft={{ lg: "16px", xl: "340px" }}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              marginTop={{ lg: "120px", xl: "60px" }}
              onClick={handleDownload}
              label="ดาวน์โหลด"
              paddingY="14px"
              paddingX="46px"
              borderRadius="8px"
              color="white"
              backgroundColor="#0C388E"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            <Box
              marginTop="16px"
              fontWeight={700}
              fontSize="32px"
            >
              รายชื่อวิชาเทียบโอน หมวดวิชาศึกษาทั่วไป
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
            {tableSize === "lg" ? (
              <Table
                size="sm"
                backgroundColor="white"
              >
                <Thead bgColor="#D7D7D7">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          padding="16px"
                          fontSize="10.5px"
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
                  <Td
                    colSpan={7}
                    style={{
                      backgroundColor: "#2E99FC",
                      color: "white",
                      fontWeight: 700
                    }}
                  >
                    ส่วนที่ 1.1 รายวิชาภาษาอังกฤษ
                  </Td>
                  {flatData.length > 0 ? (
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
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                  <Tr>
                    <Td
                      colSpan={7}
                      style={{
                        backgroundColor: "#2E99FC",
                        color: "white",
                        fontWeight: 700
                      }}
                    >
                      ส่วนที่ 1.2 รายวิชาธุรกิจและประกอบการ
                    </Td>
                  </Tr>
                  {flatData2.length > 0 ? (
                    table2.getRowModel().rows.map((row) => (
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
                    ))
                  ) : (
                    <Tr>
                      <Td
                        backgroundColor="white"
                        colSpan={7}
                      ></Td>
                    </Tr>
                  )}
                  <Tr>
                    <Td
                      colSpan={7}
                      style={{
                        backgroundColor: "#2E99FC",
                        color: "white",
                        fontWeight: 700
                      }}
                    >
                      ส่วนที่ 2 รายวิชาศึกษาทั่วไปเลือก
                    </Td>
                  </Tr>
                  {flatData3.length > 0 ? (
                    table3.getRowModel().rows.map((row) => (
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
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                  <Tr>
                    <Td
                      backgroundColor="white"
                      colSpan={3}
                      borderWidth={1}
                    >
                      หน่วยกิตรวมของวิชา ปวส
                    </Td>
                    <Td
                      backgroundColor="white"
                      colSpan={1}
                      borderWidth={1}
                    >
                      {data?.totalDipCredit}
                    </Td>
                    <Td
                      backgroundColor="white"
                      colSpan={2}
                      borderWidth={1}
                    >
                      {data?.totalUniCredit}
                    </Td>
                    <Td
                      backgroundColor="white"
                      colSpan={2}
                      borderWidth={1}
                    >
                      {data?.totalUniCredit}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            ) : (
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
                <Td
                      colSpan={7}
                      style={{
                        backgroundColor: "#2E99FC",
                        color: "white",
                        fontWeight: 700
                      }}
                    >
                      ส่วนที่ 1.1 รายวิชาภาษาอังกฤษ
                    </Td>
                <Tbody>
                  {flatData.length > 0 ? (
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
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                  <Tr>
                    <Td
                      colSpan={7}
                      style={{
                        backgroundColor: "#2E99FC",
                        color: "white",
                        fontWeight: 700
                      }}
                    >
                      ส่วนที่ 1.2 รายวิชาธุรกิจและประกอบการ
                    </Td>
                  </Tr>

                  {flatData2.length > 0 ? (
                    table2.getRowModel().rows.map((row) => (
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
                    ))
                  ) : (
                    <Tr>
                      <Td
                        backgroundColor="white"
                        colSpan={7}
                      ></Td>
                    </Tr>
                  )}
                  <Tr>
                    <Td
                      colSpan={7}
                      style={{
                        backgroundColor: "#2E99FC",
                        color: "white",
                        fontWeight: 700
                      }}
                    >
                      ส่วนที่ 2 รายวิชาศึกษาทั่วไปเลือก
                    </Td>
                  </Tr>
                  {flatData3.length > 0 ? (
                    table3.getRowModel().rows.map((row) => (
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
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                </Tbody>
                <Tr>
                  <Td
                    backgroundColor="white"
                    colSpan={3}
                    borderWidth={1}
                  >
                    หน่วยกิตรวมของวิชา ปวส
                  </Td>
                  <Td
                    backgroundColor="white"
                    colSpan={1}
                    borderWidth={1}
                  >
                    {data?.totalDipCredit}
                  </Td>
                  <Td
                    backgroundColor="white"
                    colSpan={2}
                    borderWidth={1}
                  >
                    หน่วยกิตรวมของวิชา UTCC
                  </Td>
                  <Td
                    backgroundColor="white"
                    colSpan={2}
                    borderWidth={1}
                  >
                    {data?.totalUniCredit}
                  </Td>
                </Tr>
              </Table>
            )}
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}
