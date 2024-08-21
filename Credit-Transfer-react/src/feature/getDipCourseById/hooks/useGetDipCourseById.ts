import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { getDipcourseById } from "../services/getDipCourseById.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useGetDipCourseById = () => {
  const toast = useToast()
  const { mutateAsync: onUpdateDipCourse } = useMutation({
    mutationKey: ["getDipCourseById"],
    mutationFn: getDipcourseById,
    retry: false,
    onSuccess: () => {
      toast({
        title: "เพิ่มรหัสวิชาสำเร็จ",
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
  return { onUpdateDipCourse }
}

export default useGetDipCourseById
