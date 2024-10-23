import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login } from "../services/auth.service"
import { onSetCookie } from "@/configs/handleCookie"

const useMutateLogin = () => {
  const toast = useToast()
  const router = useRouter()
  const {
    mutateAsync: onLogin,
    isPaused: isLoginPending,
    isError: isLoginError,
    isPending
  } = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    retry: false,
    onSuccess(res: string) {
      const token = res
      onSetCookie({
        jwt: token
      })
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        status: "success",
        isClosable: true
      })
      router.replace("/transfer")
    },

    onError: (e) => {
      if (e) {
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          status: "error",
          isClosable: true
        })
      }
    }
  })
  return { onLogin, isLoginError, isLoginPending, isPending }
}

export default useMutateLogin
