import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { createUser } from "../services/createUser.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateCreateUser = () => {
  const toast = useToast()
  const { mutateAsync: onCreateUser } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser,
    retry: false,
    onSuccess: () => {
      toast({
        title: "สร้างบัญชีสำเร็จ",
        status: "success",
        isClosable: true
      })
    },
    onError: (e: AxiosError<IResponseAPI>) => {
      if (e.response) {
        toast({
          title: e.response.data.message,
          status: "error",
          isClosable: true
        })
      }
    }
  })
  return { onCreateUser }
}
export default useMutateCreateUser
