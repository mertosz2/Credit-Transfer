import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { editDipCourseData } from "../services/editDipCourseData.service"
import { IEditDipCourseResponse } from "../interface/EditDipCourseData"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateEditDipCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onEditDipCourseData } = useMutation({
    mutationKey: ["editDipCourseData"],
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: IEditDipCourseResponse
    }) => {
      const response = editDipCourseData(id, data)
      return response
    },
    retry: false,
    onSuccess: () => {
      toast({
        title: "แก้ไขวิชาสำเร็จ",
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

  return { onEditDipCourseData }
}
export default useMutateEditDipCourseData
