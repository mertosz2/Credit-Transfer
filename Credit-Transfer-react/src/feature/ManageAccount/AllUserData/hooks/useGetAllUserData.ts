import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { allUserData } from "../services/allUserData.service"

export const useGetAllUserData = () => {
  const toast = useToast()
  const { data: getAllUserData } = useQuery({
    queryKey: ["allUserData"],
    queryFn: async () => {
      try {
        return await allUserData()
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
  return { getAllUserData }
}
export default useGetAllUserData
