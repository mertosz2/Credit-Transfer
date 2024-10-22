import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { roleDropdownData } from "../services/roleDropdownData.service"

const useGetRoleDorpdownData = () => {
  const toast = useToast()
  const { data: roleDropdown } = useQuery({
    queryKey: ["roleDropdownData"],
    queryFn: async () => {
      try {
        return await roleDropdownData()
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
  return { roleDropdown }
}
export default useGetRoleDorpdownData
