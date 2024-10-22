import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { deleteUniCourseData } from "../services/deleteUniCourseData.service"
import { IResponseAPI } from "@/interfaces/errorType"
import { AxiosError } from "axios"

const useMutateDeleteUniCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onDeleteUniCourse } = useMutation({
    mutationKey: ["deleteUniCourseData"],
    mutationFn: deleteUniCourseData,
    retry: false,
    onSuccess: () => {
      toast({
        title: "ลบวิชาสำเร็จ",
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
  return { onDeleteUniCourse }
}
export default useMutateDeleteUniCourseData
