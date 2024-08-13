"use client";
import {
  IDiplomaCourseList,
  IUniversityCourse,
} from "@/feature/CreditTransfer/interface/CreditTransfer";
import { Box, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";

interface IProps {
  dipData: IDiplomaCourseList;
  uniData: IUniversityCourse;
}

const CreditTransferTable = ({ dipData, uniData }: IProps) => {
  return (
    <Table variant="striped" width="100%" sx= {{tableLayout: 'auto'}}>
      
      <Tbody 
        display="flex"
        width="100%"
        borderRightWidth={1}
        borderLeftWidth={1}
        borderBottomWidth={1}
        borderColor="black"
        padding="24px"
      >
        <Tr display="flex" width="100%">
          <Td width="auto">{dipData.dipCourseId}</Td>
          <Td width="auto">{dipData.dipCourseName}</Td>
          <Td width="auto">{dipData.grade}</Td>
          <Td width="auto">{dipData.dipCredit}</Td>
          <Td width="auto">{uniData.uniCourseId}</Td>
          <Td width="auto">{uniData.uniCourseName}</Td>
          <Td width="auto">{uniData.uniCredit}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default CreditTransferTable;
