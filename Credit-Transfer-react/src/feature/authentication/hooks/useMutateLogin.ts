import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login } from "../services/auth.service"
import { onSetCookie } from "@/config/handleCookie"
import { IToken } from "../interface/auth"

const useMutateLogin = () => {
  const toast = useToast()
  const router = useRouter()
  const {
    mutateAsync: onLogin,
    isPaused: isLoginPending,
    isError: isLoginError
  } = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    retry: false,
    onSuccess(res: IToken) {
      const token = res
      onSetCookie({
        jwt: token.token
      })
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        status: "success",
        isClosable: true
      })
     
    },

    onError: (e) => {
      if (e) {
        toast({
          title: "ไม่สำเร็จ",
          status: "error",
          isClosable: true
        })
      }
    }
  })
  return { onLogin, isLoginError, isLoginPending }
}

export default useMutateLogin
