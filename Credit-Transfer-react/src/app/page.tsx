"use client"
import { Box } from "@chakra-ui/react"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const handleLogin = () => {
    router.push("/main")
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="24px"
      width="100%"
      height="100vh"
      //background="radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)"
      background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
    >
      <Box
        display="flex"
        flexDirection="column"
        paddingY="80px"
        paddingX="94px"
        backgroundColor="white"
        borderRadius="16px"
        alignItems="center"
      >
        <Box fontSize="30px">ระบบการจัดการวิชาเทียบโอนหน่วยกิต</Box>
        <Box fontSize="30px">มหาวิทยาลัยหอการค้าไทย</Box>
        <Box
          width="100%"
          height="3px"
          backgroundColor="black"
          marginTop="42px"
        ></Box>

        <Box
          marginTop="24px"
          display="flex"
          flexDirection="column"
          gap="24px"
          alignItems="center"
        >
          <TextField placeholder="รหัสนักศึกษา" />
          <TextField placeholder="รหัสผ่าน" />
          <Button
            label="เข้าสู่ระบบ"
            onClick={handleLogin}
          ></Button>
        </Box>
      </Box>
    </Box>
  )
}
