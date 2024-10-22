import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { addDipCourseData } from "../services/addDipcourseData.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateAddDipCourse = () => {
  const toast = useToast()
  const { mutateAsync: onAddDipCourseData, isPending } = useMutation({
    mutationFn: addDipCourseData,
    mutationKey: ["addDipCourseData"],
    retry: false,
    onSuccess: () => {
      toast({
        title: "เพิ่มวิชาสำเร็จ",
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
  return { onAddDipCourseData, isPending }
}
export default useMutateAddDipCourse
