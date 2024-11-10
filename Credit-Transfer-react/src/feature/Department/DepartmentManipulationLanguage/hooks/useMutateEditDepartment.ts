import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { editDepartmentData } from "../services/departmentManipulation.service"
import { IDepartmentData } from "../interface/departmentManipulation"

const useMutateEditDepartment = () => {
  const toast = useToast()
  const { mutateAsync: onEditDepartmentData } = useMutation({
    mutationKey: ["editDepartmentData"],
    mutationFn: ({
      id,
      departmentName
    }: {
      id: number
      departmentName: IDepartmentData
    }) => {
      const response = editDepartmentData(id, departmentName)
      return response
    },
    retry: false,
    onSuccess: () => {
      toast({
        title: "แก้ไขแผนกสำเร็จ",
        status: "success",
        isClosable: true
      })
    },
    onError: () => {
      toast({
        title: "แก้ไขแผนกไม่สำเร็จ",
        status: "error",
        isClosable: true
      })
    }
  })
  return { onEditDepartmentData }
}
export default useMutateEditDepartment
