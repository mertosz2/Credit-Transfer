import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { editUserData } from "../services/editUserData.service"
import { IEditUserResponse } from "../interface/EditUserData"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateEditUserData = () => {
  const toast = useToast()
  const { mutateAsync: onEditUserData } = useMutation({
    mutationKey: ["editUserData"],
    mutationFn: ({ id, data }: { id: number; data: IEditUserResponse }) => {
      const response = editUserData(id, data)
      return response
    },
    retry: false,
    onSuccess: () => {
      toast({
        title: "แก้ไขข้อมูลสำเร็จ",
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
  return { onEditUserData }
}
export default useMutateEditUserData
