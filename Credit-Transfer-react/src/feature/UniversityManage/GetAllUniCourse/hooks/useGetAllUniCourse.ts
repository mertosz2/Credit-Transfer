import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getAllUniCourse } from "../services/getAllUniCourse.service"

const useGetAllUniCourse = () => {
  const toast = useToast()
  const { data: uniCourseData, refetch: onUniCourseDataRefetch } = useQuery({
    queryKey: ["getAllUniCourse"],
    queryFn: async () => {
      try {
        return await getAllUniCourse()
      } catch (error) {
        if (typeof (error as Error)?.message === "string") {
          toast({
            title: (error as Error)?.message,
            status: "error",
            isClosable: true
          })
        }
      }
    },
    retry: false
  })
  return { uniCourseData, onUniCourseDataRefetch }
}
export default useGetAllUniCourse
