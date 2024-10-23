"use client"
import { NextRequest, NextResponse } from "next/server"

import { Box, Image, Input } from "@chakra-ui/react"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"
import useMutateLogin from "@/feature/authentication/hooks/useMutateLogin"
import { decodeToken } from "@/util/jwtToken"
import { IToken, ITokenPayload } from "@/feature/authentication/interface/auth"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import { checkExpireToken } from "@/configs/axiosConfig"
import useProfileStore, { selectOnsetProfileData } from "@/stores/profileStore"
import { ImageCustom } from "@/components/Image/Image"
import Homepage from "../asset/image/page1.jpg"
interface IProps {
  username: string
  password: string
}

export default function Home() {
  const router = useRouter()
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const { onLogin, isPending } = useMutateLogin()
  const setData = useProfileStore(selectOnsetProfileData)
  const decodeToken = (token: string): ITokenPayload | null => {
    try {
      const decoded: ITokenPayload = jwtDecode<ITokenPayload>(token) // Decode token string โดยตรง
      return decoded
    } catch (error) {
      console.error("Invalid token", error)
      return null
    }
  }

  const handleLogin = async () => {
    const loginData: IProps = { username, password }
    const loginToken = await onLogin(loginData)
    if (loginToken) {
      const decodeData = decodeToken(loginToken)
      if (decodeData) {
        setData(decodeData)
      }
      Cookies.set("accessToken", loginToken, { expires: 1 / 48 })

      router.push("/transfer")
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
      width="100%"
      height="100vh"
      paddingX={{ lg: "120px", xl: "240px" }}
      paddingY={{ lg: "90px", xl: "180px" }}
      //background="linear-gradient(356deg, rgba(180,231,229,1) 0%, rgba(240,233,196,1) 46%, rgba(242,247,247,1) 100%)"
      background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
    >
      <Box
        width="100%"
        height="100%"
        background="linear-gradient(356deg, rgba(180,231,229,1) 0%, rgba(246,246,246,1) 19%, rgba(242,247,247,1) 100%)"
        borderRadius="16px"
        borderWidth={2}
        borderColor="black"
      >
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          height="100%"
        >
          <Box width={{ lg: "60%", xl: "65%" }}>
            <Image
              width="100%"
              height="100%"
              backgroundSize="cover"
              borderTopLeftRadius={16}
              borderBottomLeftRadius={16}
              src={Homepage.src}
              alt="Homepage"
            />
          </Box>
          <Box
            width={{ lg: "40%", xl: "35%" }}
            height="100%"
            flexDirection="column"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="24px"
          >
            <Box
              whiteSpace="pre-wrap"
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              ระบบเทียบโอนรายวิชาศึกษาทั่วไป
            </Box>
            <Box
              whiteSpace="pre-wrap"
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              (ระดับ ปวส.)
            </Box>
            <Box
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              มหาวิทยาลัยหอการค้าไทย
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              gap="24px"
            >
              <Input
                type="text"
                value={username}
                onChange={handleChangeUsername}
                placeholder="ชื่อผู้ใช้งาน"
                borderWidth="2px"
                borderColor="black"
              />
              <TextField
                type="password"
                value={password}
                onChange={handleChangePassword}
                placeholder="รหัสผ่าน"
              />
              <Button
                borderRadius={8}
                backgroundColor="#0C388E"
                color="white"
                label={"เข้าสู่ระบบ"}
                onClick={handleLogin}
              ></Button>
              <Button
                borderRadius={8}
                backgroundColor="grey"
                color="white"
                label={"เข้าสู่ระบบแบบผู้เยี่ยมชม"}
                onClick={() => {
                  router.push(`/transfer`)
                }}
              ></Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
