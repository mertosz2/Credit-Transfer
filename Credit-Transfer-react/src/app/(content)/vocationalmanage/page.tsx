"use client"
import SideBar from "@/components/SideBar"
import { IFlatDiplomaCourseList } from "@/feature/CreditTransfer/interface/CreditTransfer"
import { Box } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"

export default function VocationalManage() {
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
  //   const table = useReactTable({
  //     data: flatData,
  //     columns,
  //     getCoreRowModel: getCoreRowModel()
  //   })
  return (
    <>
      <SideBar />
      <Box
        height="100%"
        marginLeft="60px"
      ></Box>
    </>
  )
}
