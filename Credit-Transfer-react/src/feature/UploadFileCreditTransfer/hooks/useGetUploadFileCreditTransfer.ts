import { useToast } from "@chakra-ui/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UploadFileCreditTransfer } from "../services/UploadFileCreditTransfer.service"

const useGetUploadFileCreditTransfer = () =>{
    const toast = useToast()
    const {mutateAsync: onUploadFile , isPending}= useMutation({
        mutationKey: ["UploadFIleCreditTransfer"],
        mutationFn: UploadFileCreditTransfer,
        retry:false,
        onSuccess: () => {
            toast({
                title: "Import File Success",
                status: "success",
                isClosable: true
            })
            console.log()
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
    return {onUploadFile,isPending}
}

export default useGetUploadFileCreditTransfer