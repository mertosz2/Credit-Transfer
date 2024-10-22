import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { uniCourseDropdownData } from "../services/uniCourseDropdownData.service"

const useGetUniCourseDropdownData = () => {
  const toast = useToast()
  const { data: dropdownUniData } = useQuery({
    queryKey: ["uniCourseDropdownData"],
    queryFn: async () => {
      try {
        return await uniCourseDropdownData()
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
  return { dropdownUniData }
}
export default useGetUniCourseDropdownData
