"use client";
import CreditTransferTable from "@/app/components/CreditTransferTable";
import { Box } from "@chakra-ui/react";
import React from "react";
export default function main() {
  return (
    <Box
      width="100%"
      height="100vh"
      background="radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)"
      paddingX="400px"
    >
      <Box display="flex" width="100%" height="100%" backgroundColor="white">
        <Box
          display="flex"
          flexDirection="column"
          padding="24px"
          width="20%"
          height="100%"
          alignItems="center"
          backgroundColor="yellow"
        >
          <Box>asdasd</Box>
          <Box>asdasd</Box>
          <Box>asdasd</Box>
          <Box>asdasd</Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          backgroundColor="pink"
        >
          <Box
            display="flex"
            alignItems="center"
            backgroundColor="blue"
            flexDirection="column"
          >
            <Box>asdasd</Box>
            <Box>asdasd</Box>
            <Box>asdasd</Box>
          </Box>
          <Box
            marginTop="24px"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <CreditTransferTable/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
