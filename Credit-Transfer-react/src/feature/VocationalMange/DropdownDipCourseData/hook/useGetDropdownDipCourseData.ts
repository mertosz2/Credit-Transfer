import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getDropDownDipCourseData } from "../services/dropdownDipCourseData.service"

const useGetDropdownDipCourseData = () => {
  const toast = useToast()
  const { data: dropdownData } = useQuery({
    queryKey: ["getDropdownDipCourseData"],
    queryFn: async () => {
      try {
        return await getDropDownDipCourseData()
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
  return { dropdownData }
}
export default useGetDropdownDipCourseData
