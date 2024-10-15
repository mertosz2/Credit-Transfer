"use client"
import SideBar from "@/components/SideBar"
import useSortData from "@/feature/CreditTransfer/hooks/useSortData"
import {
  ICreditTransferResponse,
  IFlatDiplomaCourseList,
  TKey
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import { getStringAfterUnderscore } from "@/util/string"
import {
  Box,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Tfoot,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"

export default function VocationalManage() {
  const { onSortData } = useSortData()
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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ICreditTransferResponse | string | null
    direction: "ascending" | "descending"
  } | null>(null)

  const handleSort = useCallback(
    async (key: TKey) => {
      let direction: "ascending" | "descending" = "ascending"

      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending"
      }

      // function api
      if (sortConfig) {
        const sortedData = await onSortData({
          data: displayData,
          key: key,
          direction: sortConfig.direction === "ascending"
        })
        setDisplayData(sortedData)
        setFlatData(flattenData(sortedData))
      }
      setSortConfig({ key, direction })
    },
    [displayData, onSortData, sortConfig]
  )
  const renderTable = useMemo(() => {
    return (
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
                      padding="16px"
                      cursor="pointer"
                      key={header.id}
                      onClick={() =>
                        handleSort(
                          header.column.id.includes("_")
                            ? (getStringAfterUnderscore(
                                header.column.id
                              ) as TKey)
                            : (header.column.id as TKey)
                        )
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <Icon
                        as={
                          sortConfig && sortConfig.direction === "ascending"
                            ? ChevronUpIcon
                            : ChevronDownIcon
                        }
                      />
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {flatData &&
              flatData.length > 0 &&
              displayData &&
              displayData.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    // Apply colspan to universityCourse columns
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
              ))}
          </Tbody>
          <Tfoot
            display="flex"
            padding="8px"
          ></Tfoot>
        </Table>
      </TableContainer>
    )
  }, [displayData, flatData, handleSort, sortConfig, table])

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
