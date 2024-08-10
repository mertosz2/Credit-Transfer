"use client";
import {
  IDiplomaCourseList,
  IUniversityCourse,
} from "@/feature/CreditTransfer/interface/CreditTransfer";
import { Box, Table, Tbody, Thead, Tr } from "@chakra-ui/react";

interface IProps {
  dipData: IDiplomaCourseList;
  uniData: IUniversityCourse;
}

const CreditTransferTable = ({ dipData, uniData }: IProps) => {
  console.log("dipData:", dipData);
  console.log("uniData:", uniData);

  return (
    <Table variant="simple" width="100%">
      <Thead
        display="flex"
        width="100%"
        borderWidth={1}
        borderTopRadius={16}
        borderColor="black"
        paddingY="24px"
      >
        <Tr display="flex" width="100%">
          <Box width="14.28%" textAlign="center">รหัสวิชา</Box>
          <Box width="14.28%" textAlign="center">วิชาที่ขอเทียบโอน</Box>
          <Box width="14.28%" textAlign="center">เกรด</Box>
          <Box width="14.28%" textAlign="center">หน่วยกิต</Box>
          <Box width="14.28%" textAlign="center">รหัสวิชา</Box>
          <Box width="14.28%" textAlign="center">วิชาที่เทียบโอนหน่วยกิตได้</Box>
          <Box width="14.28%" textAlign="center">หน่วยกิต</Box>
        </Tr>
      </Thead>

      <Tbody
        display="flex"
        width="100%"
        borderRightWidth={1}
        borderLeftWidth={1}
        borderBottomWidth={1}
        borderColor="black"
        paddingY="24px"
      >
        <Tr display="flex" width="100%">
          <Box width="14.28%" textAlign="center">{dipData.dipCourseId}</Box>
          <Box width="14.28%" textAlign="center">{dipData.dipCourseName}</Box>
          <Box width="14.28%" textAlign="center">{dipData.dipCredit}</Box>
          <Box width="14.28%" textAlign="center">{dipData.grade}</Box>
          <Box width="14.28%" textAlign="center">{uniData.uniCourseId}</Box>
          <Box width="14.28%" textAlign="center">{uniData.uniCourseName}</Box>
          <Box width="14.28%" textAlign="center">{uniData.uniCredit}</Box>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default CreditTransferTable;
