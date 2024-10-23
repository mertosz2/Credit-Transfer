import { Box, useToast } from "@chakra-ui/react"
import { ImageCustom } from "../Image/Image"
import Button from "../Button/Button"
import { RiLogoutBoxFill } from "@remixicon/react"
import logo from "../SideBar/image/logo.png"
import Cookies from "js-cookie"
import { onRemoveCookie } from "@/configs/handleCookie"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { decodeToken } from "@/util/jwtToken"
import useProfileStore, {
  resetProfile,
  selectProfileData
} from "@/stores/profileStore"

const SideBar = ({ id }: { id: number }) => {
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
    setAccessToken(undefined)
    onResetProfile()
    router.replace("/")
  }

  const handleCreditTransfer = () => {
    router.replace("/transfer")
  }
  const handleVocationalManage = () => {
    router.replace("/vocationalmanage")
  }
  const handleUniversityManage = () => {
    router.replace("/universitymanage")
  }
  const handleManageAccount = () => {
    router.replace("/manageaccount")
  }
  const checkRole = () => {
    if (data?.role.includes("SUPER_ADMIN")) {
      return true
    }
    return false
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
                        display="flex"
                        flexDirection="column"
                        gap="10px"
                      >
                        <Button
                          label={"เทียบโอนรายวิชา"}
                          onClick={handleCreditTransfer}
                          color={id == 1 ? " white" : "black"}
                          borderRadius="8px"
                          backgroundColor={id == 1 ? " #00E0FF" : "white"}
                        />
                        <Button
                          paddingY="8px"
                          paddingX="60px"
                          label={"จัดการวิชา ปวส"}
                          onClick={handleVocationalManage}
                          color={id == 2 ? " white" : "black"}
                          borderRadius="8px"
                          backgroundColor={id == 2 ? " #00E0FF" : "white"}
                        />
                        <Button
                          label={"จัดการวิชา UTCC"}
                          onClick={handleUniversityManage}
                          color={id == 3 ? " white" : "black"}
                          borderRadius="8px"
                          backgroundColor={id == 3 ? " #00E0FF" : "white"}
                        />
                        {checkRole() ? (
                          <Button
                            label={"จัดการบัญชี"}
                            onClick={handleManageAccount}
                            color={id == 4 ? " white" : "black"}
                            borderRadius="8px"
                            backgroundColor={id == 4 ? " #00E0FF" : "white"}
                          />
                        ) : null}
                      </Box>
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
                      {data.name}
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
          position="absolute"
          flexDirection={{ lg: "row", xl: "column" }}
          padding="20px"
          width={{ lg: "100%", xl: "auto" }}
          height={{ lg: "100px", xl: "100vh" }}
          borderWidth="1px"
          borderColor="black"
          alignItems="center"
          backgroundColor="#000080"
          justifyContent="space-between"
          gap="24px"
        >
          <Box>
            <ImageCustom
              width={220}
              height={108}
              src={logo}
              alt={"logo"}
            />
          </Box>

          <Box
            marginTop={{ lg: "16px", xl: "0px" }}
            display="flex"
            flexDirection="column"
            width={{ lg: "20%", xl: "100%" }}
            justifyContent={{ lg: "flex-end", xl: "space-between" }}
            height="100%"
            gap={{ lg: "10px", xl: "0px" }}
          >
            <Button
              paddingY="8px"
              label={"เทียบโอนรายวิชา"}
              backgroundColor={id == 1 ? " #00E0FF" : "white"}
              color={id == 1 ? " white" : "black"}
              fontWeight={id == 1 ? 700 : 400}
              borderRadius="8px"
            >
              เทียบโอนรายวิชา
            </Button>

            <Button
              paddingY="8px"
              label={"ออกจากระบบ"}
              onClick={handleLogout}
              color="white"
              borderRadius="8px"
              backgroundColor="#FF4E4E"
              leftIcon={
                <RiLogoutBoxFill
                  color="#FFFFFF"
                  size={16}
                />
              }
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SideBar
