import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { deleteDepartmentById } from "../services/departmentManipulation.service"

const useMutateDeleteDepartment = () => {
  const toast = useToast()
  const { mutateAsync: onDeleteDepartment } = useMutation({
    mutationKey: ["deleteDepartmentById"],
    mutationFn: deleteDepartmentById,
    retry: false,
    onSuccess: () => {
      toast({
        title: "ลบแผนกสำเร็จ",
        status: "success",
        isClosable: true
      })
    },
    onError: () => {
      toast({
        title: "ลบแผนกไม่สำเร็จ",
        status: "error",
        isClosable: true
      })
    }
  })
  return { onDeleteDepartment }
}
export default useMutateDeleteDepartment
