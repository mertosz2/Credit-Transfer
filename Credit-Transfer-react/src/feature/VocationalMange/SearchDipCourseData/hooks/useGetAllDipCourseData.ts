import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getSearchDipCourseData } from "../services/getAllDipCourseData.service"

const useGetAllDipCourseData = () => {
  const toast = useToast()
  const { data: getAllDipData } = useQuery({
    queryKey: ["searchDipCourseData"],
    queryFn: async () => {
      try {
        return await getSearchDipCourseData()
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
  return { getAllDipData }
}
export default useGetAllDipCourseData
