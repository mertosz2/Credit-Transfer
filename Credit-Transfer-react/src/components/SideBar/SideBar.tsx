import { Box, useToast } from "@chakra-ui/react"
import { ImageCustom } from "../Image/Image"
import Button from "../Button/Button"
import { RiLogoutBoxFill } from "@remixicon/react"
import logo from "../SideBar/image/logo.png"
import Cookies from "js-cookie"
import { onRemoveCookie } from "@/config/handleCookie"
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
  const processData = data?.role
  const toast = useToast()
  const router = useRouter()

  const [activePath, setActivePath] = useState<number>()
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
  console.log(activePath)
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
                        display="flex"
                        flexDirection="column"
                        gap="10px"
                      >
                        <Button
                          label={"เทียบโอนรายวิชา"}
                          onClick={handleCreditTransfer}
                          color="black"
                          borderRadius="8px"
                          backgroundColor={id == 1 ? " #00E0FF" : "white"}
                        />
                        <Button
                          paddingY="8px"
                          paddingX="60px"
                          label={"จัดการวิชา ปวส"}
                          onClick={handleVocationalManage}
                          color="black"
                          borderRadius="8px"
                          backgroundColor={id == 2 ? " #00E0FF" : "white"}
                        />
                        <Button
                          label={"จัดการวิชา มหาวิทยาลัย"}
                          onClick={handleUniversityManage}
                          color="black"
                          borderRadius="8px"
                          backgroundColor={id == 3 ? " #00E0FF" : "white"}
                        />
                        {checkRole() ? (
                          <Button
                            label={"จัดการบัญชี"}
                            onClick={handleManageAccount}
                            color="black"
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
                backgroundColor={activePath == 1 ? " #00E0FF" : "white"}
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
