import { useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { getNextDipCourse } from "../services/getAlldipCourse.service"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"

const useGetNextDipCourse = (page: number) => {
  const toast = useToast()

  const {
    data: nextPage,
    refetch: refetchNextPage,
    isFetching
  } = useQuery({
    queryKey: ["getNextDipCourse", page],
    queryFn: async () => {
      try {
        return await getNextDipCourse(page)
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

  return { nextPage, refetchNextPage, isFetching }
}

export default useGetNextDipCourse
