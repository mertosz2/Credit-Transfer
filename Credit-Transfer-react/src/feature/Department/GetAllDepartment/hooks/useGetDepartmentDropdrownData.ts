import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getDepartmentDropdownData } from "../services/getAllDepartment.service"

const useGetDepartmentDropdownData = () => {
  const toast = useToast()
  const { data: getDepartData } = useQuery({
    queryKey: ["DepartmentDropdownData"],
    queryFn: async () => {
      try {
        return await getDepartmentDropdownData()
      } catch (error) {
        if (typeof (error as Error)?.message === "string") {
          toast({
            title: (error as Error).message,
            status: "error",
            isClosable: true
          })
        }
      }
    }
  })
  return { getDepartData }
}
export default useGetDepartmentDropdownData