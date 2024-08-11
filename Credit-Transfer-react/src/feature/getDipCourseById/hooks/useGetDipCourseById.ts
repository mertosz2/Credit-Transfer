import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { getDipcourseById } from "../services/getDipCourseById.service"

const useGetDipCourseById = () =>{

    const toast = useToast()
    const {mutateAsync: onUpdateDipCourse}=useMutation({
        mutationKey: ["getDipCourseById"],
        mutationFn: getDipcourseById,
        retry:false,
        onSuccess: () => {
            toast({
                title: "DipCourse updated",
                status: "success",
                isClosable: true
            })
        },
        
        onError: (e) => {
            if (typeof e?.message === "string") {
                toast({
                  title: e.message,
                  status: "error",
                  isClosable: true
                })
              }
        }

    })
    return {onUpdateDipCourse}
}

export default useGetDipCourseById