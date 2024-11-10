import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getAllDepartment } from "../services/getAllDepartment.service"

const useGetAllDepartment = () => {
  const toast = useToast()
  const { data: getDepartmentData } = useQuery({
    queryKey: ["getAllDepartment"],
    queryFn: async () => {
      try {
        return await getAllDepartment()
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
  return { getDepartmentData }
}
export default useGetAllDepartment
