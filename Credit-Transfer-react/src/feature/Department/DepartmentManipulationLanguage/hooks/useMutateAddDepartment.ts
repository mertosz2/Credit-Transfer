import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { addDepartmentData } from "../services/departmentManipulation.service"

const useMutateAddDepartment = () => {
  const toast = useToast()
  const { mutateAsync: onAddDepartmentData } = useMutation({
    mutationFn: addDepartmentData,
    mutationKey: ["addDepartmentData"],
    retry: false,
    onSuccess: () => {
      toast({
        title: "เพิ่มแผนกสำเร็จ",
        status: "success",
        isClosable: true
      })
    },
    onError: () => {
      toast({
        title: "เพิ่มแผนกไม่สำเร็จ",
        status: "error",
        isClosable: true
      })
    }
  })
  return { onAddDepartmentData }
}
export default useMutateAddDepartment
