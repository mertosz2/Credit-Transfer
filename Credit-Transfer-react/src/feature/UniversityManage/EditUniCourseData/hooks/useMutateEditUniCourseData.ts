import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { editUniCourseData } from "../services/editUniCourseData.service"
import { IEditUniCourseResponse } from "../interface/EditUniCourseData"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateEditUniCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onEditUniCourseData } = useMutation({
    mutationKey: ["editUniCourseData"],
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: IEditUniCourseResponse
    }) => {
      const response = editUniCourseData(id, data)
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
  return { onEditUniCourseData }
}
export default useMutateEditUniCourseData
