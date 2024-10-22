import { useMutation } from "@tanstack/react-query"
import { sortDipCourseData } from "../services/sortDipCourseData.service"
import { useToast } from "@chakra-ui/react"

const useMutateSortDipCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onSortDipCourseData } = useMutation({
    mutationKey: ["sortDipCourseData"],
    mutationFn: sortDipCourseData,
    retry: false,
    onError: () => {
      toast({
        title: "การจัดเรียงไม่สำเร็จ",
        status: "error",
        isClosable: true
      })
    }
  })
  return { onSortDipCourseData }
}

export default useMutateSortDipCourseData
