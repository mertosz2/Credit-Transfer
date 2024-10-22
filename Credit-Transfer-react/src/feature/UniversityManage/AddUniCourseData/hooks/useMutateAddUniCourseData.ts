import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { addUniCourseData } from "../services/addUniCourseData.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useMutateAddUniCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onAddUniCourseData } = useMutation({
    mutationKey: ["addUniCourseData"],
    mutationFn: addUniCourseData,
    retry: false,
    onSuccess: () =>
      toast({
        title: "เพิ่มวิชาสำเร็จ",
        status: "success",
        isClosable: true
      }),
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
  return { onAddUniCourseData }
}
export default useMutateAddUniCourseData
