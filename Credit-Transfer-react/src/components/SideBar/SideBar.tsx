import { Box, useToast } from "@chakra-ui/react"
import { ImageCustom } from "../Image/Image"
import Button from "../Button/Button"
import { RiLogoutBoxFill } from "@remixicon/react"
import logo from "../SideBar/image/logo.png"
import Cookies from "js-cookie"
import { onRemoveCookie } from "@/config/handleCookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { decodeToken } from "@/util/jwtToken"
import useProfileStore, {
  resetProfile,
  selectProfileData
} from "@/stores/profileStore"

const SideBar = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    Cookies.get("accessToken")
  )
  const onResetProfile = useProfileStore(resetProfile)
  const data = useProfileStore(selectProfileData)
  const toast = useToast()
  const router = useRouter()
  const handleLogout = () => {
    toast({
      title: "ออกจากระบบ",
      status: "success",
      isClosable: true
    })
    onRemoveCookie()

    setAccessToken(undefined) // อัปเดต state เมื่อ logout
    onResetProfile()
    router.replace("/")
  }

   const handleVocationalManage  = () =>{
    router.replace("/vocationalmanage")
   }
  return (
    <Box display="flex">
      {data?.role && data.role.length > 0 ? (
        <Box>
          {data?.role.map((item, index) => {
            return (
              <Box key={index}>
                <Box
                  display="flex"
                  position="fixed"
                  flexDirection="column"
                  padding="20px"
                  minW="200px"
                  height="100vh"
                  borderWidth="1px"
                  borderColor="black"
                  alignItems="center"
                  backgroundColor="#000080"
                  textColor="white"
                  gap="24px"
                >
                  <ImageCustom
                    width={220}
                    height={108}
                    src={logo}
                    alt={"logo"}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    gap="10px"
                  >
                    <Box
                      flex={1}
                      display="flex"
                      flexDirection="column"
                      gap="10px"
                    >
                      <Box
                        paddingY="8px"
                        paddingX="60px"
                        backgroundColor="white"
                        color="black"
                        borderRadius="8px"
                      >
                        เทียบโอนรายวิชา
                      </Box>
                      <Button
                        label={"จัดการวิชา ปวส"}
                        onClick={handleVocationalManage}
                        color="black"
                        borderRadius="8px"
                        backgroundColor="white"
                        leftIcon={<RiLogoutBoxFill color="#FFFFFF" />}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="center"
                      paddingY="8px"
                      paddingX="60px"
                      backgroundColor="white"
                      color="black"
                      borderRadius="8px"
                    >
                      {item}
                    </Box>
                    <Button
                      label={"ออกจากระบบ"}
                      onClick={handleLogout}
                      color="white"
                      borderRadius="8px"
                      backgroundColor="#FF4E4E"
                      leftIcon={<RiLogoutBoxFill color="#FFFFFF" />}
                    />
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box
          display="flex"
          position="fixed"
          flexDirection="column"
          padding="20px"
          minW="200px"
          height="100vh"
          borderWidth="1px"
          borderColor="black"
          alignItems="center"
          backgroundColor="#000080"
          textColor="white"
          gap="24px"
        >
          <ImageCustom
            width={220}
            height={108}
            src={logo}
            alt={"logo"}
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            gap="10px"
          >
            <Box flex={1}>
              <Box
                paddingY="8px"
                paddingX="60px"
                backgroundColor="white"
                color="black"
                borderRadius="8px"
              >
                เทียบโอนรายวิชา
              </Box>
            </Box>

         
            <Button
              label={"ออกจากระบบ"}
              onClick={handleLogout}
              color="white"
              borderRadius="8px"
              backgroundColor="#FF4E4E"
              leftIcon={<RiLogoutBoxFill color="#FFFFFF" />}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SideBar
