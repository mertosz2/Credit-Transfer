import { Box, Img, useToast } from "@chakra-ui/react"
import { ImageCustom } from "../Image/Image"
import Button from "../Button/Button"
import { RiLogoutBoxFill } from "@remixicon/react"
import logo from "../../asset/image/logo.png"
import { onRemoveCookie } from "@/configs/handleCookie"
import { useRouter } from "next/navigation"
import useProfileStore, {
  resetProfile,
  selectProfileData
} from "@/stores/profileStore"

const SideBar = ({ id }: { id: number }) => {
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
    onResetProfile()
    router.replace("/")
  }

  const handleCreditTransfer = () => {
    router.push("/transfer")
  }
  const handleVocationalManage = () => {
    router.push("/vocationalmanage")
  }
  const handleUniversityManage = () => {
    router.push("/universitymanage")
  }
  const handleManageAccount = () => {
    router.push("/manageaccount")
  }
  const handleDepartment = () => {
    router.push("/department")
  }
  const checkRoleSuperAdmin = () => {
    if (data?.role.includes("SUPER_ADMIN")) {
      return true
    }
    return false
  }
  const checkRole = () => {
    if (data?.role.includes("ADMIN") || data?.role.includes("SUPER_ADMIN")) {
      return true
    }
    return false
  }
  return (
    <Box display="flex">
      {checkRole() ? (
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
          <Img
            width={220}
            height={108}
            src="https://credit-transferz2.s3.ap-southeast-1.amazonaws.com/img/logo.png"
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

                {checkRoleSuperAdmin() ? (
                  <>
                    <Button
                      label={"จัดการแผนก"}
                      onClick={handleDepartment}
                      color={id == 4 ? " white" : "black"}
                      borderRadius="8px"
                      backgroundColor={id == 4 ? " #00E0FF" : "white"}
                    />
                    <Button
                      label={"จัดการบัญชีผู้ใช้"}
                      onClick={handleManageAccount}
                      color={id == 5 ? " white" : "black"}
                      borderRadius="8px"
                      backgroundColor={id == 5 ? " #00E0FF" : "white"}
                    />
                  </>
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
              {data?.name}
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
      ) : (
        <Box
          display="flex"
          position="absolute"
          flexDirection={{ lg: "row", xl: "column" }}
          padding="20px"
          width={{ lg: "100%", xl: "auto" }}
          height={{ lg: "100px", xl: "100%" }}
          borderWidth="1px"
          borderColor="black"
          alignItems="center"
          backgroundColor="#000080"
          justifyContent="space-between"
          gap="24px"
        >
          <Box>
            <Img
              width={220}
              height={108}
              src="https://credit-transferz2.s3.ap-southeast-1.amazonaws.com/img/logo.png"
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
              onClick={() => {
                router.push("/transfer")
              }}
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
