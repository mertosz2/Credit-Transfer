"use client"
import Button from "@/components/Button"
import {
  ICreditTransferResponse,
  IDiplomaCourseList,
  IFlatDiplomaCourseList
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import useCreditTransferStore, {
  selectCreditTransferData
} from "@/stores/creditTransferStore"
import { Box, Table, TableContainer, Th, Thead, Tr } from "@chakra-ui/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useEffect } from "react"

export default function Report() {
  const columnHelper = createColumnHelper<IFlatDiplomaCourseList>()
  const data = useCreditTransferStore(selectCreditTransferData)
  const columns = [
    columnHelper.accessor("dipCourseId", {
      header: () => <Box whiteSpace="pre-wrap">รหัสวิชา{"\n"}Course Code</Box>,
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("dipCourseName", {
      header: "Course Transferred From",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("grade", {
      header: "Grade",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("dipCredit", {
      header: "Credit",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("universityCourse.uniCourseId", {
      header: "University Course Code",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    }),
    columnHelper.accessor("universityCourse.uniCourseName", {
      header: "Transferred Course Equivalents",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    }),
    columnHelper.accessor("universityCourse.uniCredit", {
      header: "University Credit",
      cell: (info) => {
        return info.row.original.isFirstInGroup ? info.getValue() : null
      }
    })
  ]
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  useEffect(() => {
    data
    console.log("Stored Data:", data)
  }, [data])

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
          label="ดาวน์โหลด"
          paddingY="14px"
          paddingX="46px"
          borderRadius="8px"
          color="white"
          backgroundColor="#0C388E"
        ></Button>
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
          borderRadius: 16
        }}
      >
        <Table size="sm">
          <Thead bgColor="#D7D7D7">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      padding="16px"
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
        </Table>
      </TableContainer>
    </Box>
  )
}
