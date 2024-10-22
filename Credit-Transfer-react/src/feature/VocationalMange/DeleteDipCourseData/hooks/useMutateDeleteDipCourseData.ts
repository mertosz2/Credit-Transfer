import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { deleteDipCourseData } from "../services/deleteDipCourseData.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateDeleteDipCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onDeleteDipCourse, isPending } = useMutation({
    mutationFn: deleteDipCourseData,
    mutationKey: ["deleteDipCourseData"],
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
  return { onDeleteDipCourse, isPending }
}
export default useMutateDeleteDipCourseData
