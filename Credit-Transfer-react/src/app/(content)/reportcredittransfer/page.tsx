"use client"
import Button from "@/components/Button"
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
  Th,
  Thead,
  Tr
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
      // ลบ
      document.body.removeChild(link)
    }
  }

  return (
    <Box
      width="100%"
      height="100%"
      paddingRight="120px"
      paddingLeft="240px"
      marginTop="60px"
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
      >
        <Button
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
        <Table size="md">
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
            {(flatData.length > 0 ||
              flatData2.length > 0 ||
              flatData3.length > 0) && (
              <>
                <>
                  <Tr>
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
                  </Tr>
                  {flatData.length > 0 ? (
                    <>
                      {flatData.map((item, index) => (
                        <Tr
                          key={index}
                          paddingY="8px"
                        >
                          <Td>{item.dipCourseId}</Td>
                          <Td>{item.dipCourseName}</Td>
                          <Td>{item.grade}</Td>
                          <Td>{item.dipCredit}</Td>
                          <Td>{item.universityCourse.uniCourseId}</Td>
                          <Td>{item.universityCourse.uniCourseName}</Td>
                          <Td>{item.universityCourse.uniCredit}</Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                </>

                <>
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
                    <>
                      {flatData2.map((item, index) => (
                        <Tr
                          key={index}
                          paddingY="8px"
                        >
                          <Td>{item.dipCourseId}</Td>
                          <Td>{item.dipCourseName}</Td>
                          <Td>{item.grade}</Td>
                          <Td>{item.dipCredit}</Td>
                          <Td>{item.universityCourse.uniCourseId}</Td>
                          <Td>{item.universityCourse.uniCourseName}</Td>
                          <Td>{item.universityCourse.uniCredit}</Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                </>

                <>
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
                    <>
                      {flatData3.map((item, index) => (
                        <Tr
                          key={index}
                          paddingY="8px"
                        >
                          <Td>{item.dipCourseId}</Td>
                          <Td>{item.dipCourseName}</Td>
                          <Td>{item.grade}</Td>
                          <Td>{item.dipCredit}</Td>

                          <Td>{item.universityCourse.uniCourseId}</Td>
                          <Td>{item.universityCourse.uniCourseName}</Td>
                          <Td>{item.universityCourse.uniCredit}</Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <Tr>
                      <Td colSpan={7}></Td>
                    </Tr>
                  )}
                </>
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
