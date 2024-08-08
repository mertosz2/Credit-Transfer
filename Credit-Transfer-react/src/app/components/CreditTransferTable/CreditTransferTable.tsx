import { Box, Td, Tr, Table, Tbody, Thead } from "@chakra-ui/react";
import React from "react";

const CreditTransferTable = () => {
  return (
    <Table variant="simple">
        <Thead display="flex" flexDirection="row" gap="16px" padding="24px">
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>รหัสวิชา</Box>
              <Box>Course Code</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>วิชาที่ขอเทียบโอน</Box>
              <Box>Course Transferred From</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>เกรด</Box>
              <Box>Grade</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>หน่วยกิต</Box>
              <Box>Credit</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>รหัสวิชา</Box>
              <Box>Course Code</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>วิชาที่เทียบโอนหน่วยกิตได้</Box>
              <Box>Course Transferred From</Box>
           
            </Box>
          </Tr>
          <Tr>
            <Box display="flex" flexDirection="column">
              <Box>หน่วยกิต</Box>
              <Box>Credit</Box>
           
            </Box>
          </Tr>
          
        </Thead>
    </Table>
  );
};

export default CreditTransferTable;
