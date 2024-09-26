"use client"
import { Box } from "@chakra-ui/react"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"
import useMutateLogin from "@/feature/authentication/hooks/useMutateLogin"
import { decodeToken } from "@/util/jwtToken"
import { IToken, ITokenPayload } from "@/feature/authentication/interface/auth"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import { checkExpireToken } from "@/config/axiosConfig"
import useProfileStore, { selectOnsetProfileData } from "@/stores/profileStore"
interface IProps {
  username: string
  password: string
}

export default function Home() {
  const router = useRouter()
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [token, setToken] = useState<IToken>()
  const { onLogin } = useMutateLogin()
  const setData = useProfileStore(selectOnsetProfileData)
  const decodeToken = (token: string): ITokenPayload | null => {
    try {
      const decoded: ITokenPayload = jwtDecode<ITokenPayload>(token) // Decode token string โดยตรง
      console.log(decoded) // แสดงข้อมูลที่ decode ได้
      return decoded
    } catch (error) {
      console.error("Invalid token", error)
      return null
    }
  }

  const handleLogin = async () => {
    const loginData: IProps = { username, password }
    const loginToken = await onLogin(loginData) // เพิ่มการตรวจสอบประเภท loginToken

    if (loginToken) {
      const decodeData = decodeToken(loginToken)
      console.log(decodeData)
      if (decodeData) {
        setData(decodeData)
      }
    }
  }

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
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
          <TextField
            value={username}
            onChange={handleChangeUsername}
            placeholder="รหัสนักศึกษา"
          />
          <TextField
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="รหัสผ่าน"
          />

          <Button
            label="เข้าสู่ระบบ"
            onClick={handleLogin}
          ></Button>
        </Box>
      </Box>
    </Box>
  )
}
