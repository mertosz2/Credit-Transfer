import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getCreateUniCourseDropdown } from "../services/addUniCourseData.service"

const useGetCreateUniCourseDropdown = () => {
  const toast = useToast()
  const { data: getUniCourseDropdown } = useQuery({
    queryKey: ["getCreateUniCourseDropdown"],
    queryFn: async () => {
      try {
        return await getCreateUniCourseDropdown()
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
  return { getUniCourseDropdown }
}
export default useGetCreateUniCourseDropdown
