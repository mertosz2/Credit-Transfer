import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getSearchUniCourseData } from "../services/getAllUniCourse.service"

const useGetAllNewUniCourse = () => {
  const toast = useToast()
  const { data: getUniCourseData } = useQuery({
    queryKey: ["SearchUniCourseData"],
    queryFn: async () => {
      try {
        return await getSearchUniCourseData()
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
  return { getUniCourseData }
}
export default useGetAllNewUniCourse
