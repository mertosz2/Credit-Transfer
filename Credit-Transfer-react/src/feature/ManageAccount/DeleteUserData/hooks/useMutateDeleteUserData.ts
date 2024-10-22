import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { deleteUserData } from "../services/deleteUserData.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateDeleteUserData = () => {
  const toast = useToast()
  const { mutateAsync: onDeleteUserData } = useMutation({
    mutationKey: ["deleteUserData"],
    mutationFn: deleteUserData,
    retry: false,
    onSuccess: () => {
      toast({
        title: "ลบข้อมูลผู้ใช้สำเร็จ",
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
  return { onDeleteUserData }
}
export default useMutateDeleteUserData
