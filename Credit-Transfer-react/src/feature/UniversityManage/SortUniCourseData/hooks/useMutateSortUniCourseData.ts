import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { sortUniCourseData } from "../services/sortUniCourseDatat.service"

const useMutateSortUniCourseData = () => {
  const toast = useToast()
  const { mutateAsync: onSortUniCourseData } = useMutation({
    mutationKey: ["sortUniCourseData"],
    mutationFn: sortUniCourseData,
    retry: false,
    onError: () =>
      toast({
        title: "การจัดเรียงไม่สำเร็จ",
        status: "error",
        isClosable: true
      })
  })
  return { onSortUniCourseData }
}
export default useMutateSortUniCourseData
