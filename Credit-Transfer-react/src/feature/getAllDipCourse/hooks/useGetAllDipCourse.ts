import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getAllDipCourse } from "../services/getAlldipCourse.service"

const useGetAllDipCourse = () => {
  const toast = useToast()
  const { data: dipCourseData, refetch } = useQuery({
    queryKey: ["getAllDipCourse"],
    queryFn: async () => {
      try {
        return await getAllDipCourse()
      } catch (error) {
        if (typeof (error as Error)?.message === "string") {
          toast({
            title: (error as Error).message,
            status: "error",
            isClosable: true
          })
        }
      }
    },
    retry: false
  })
  return { dipCourseData, refetch }
}
export default useGetAllDipCourse
