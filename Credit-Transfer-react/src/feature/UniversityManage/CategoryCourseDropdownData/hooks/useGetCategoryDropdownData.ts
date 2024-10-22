import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { categoryCourseDropdownData } from "../services/categoryCourseDropdownData.service"

const useGetCategoryDropdownData = () => {
  const toast = useToast()
  const { data: categoryCourseData } = useQuery({
    queryKey: ["categoryCourseDropdownData"],
    queryFn: async () => {
      try {
        return await categoryCourseDropdownData()
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
  return { categoryCourseData }
}
export default useGetCategoryDropdownData
