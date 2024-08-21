import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { downloadCreditTransferData } from "../services/downloadCreditTransferData.service"

const useGetDownloadData = () => {
  const toast = useToast()
  const { mutateAsync: onDownload } = useMutation({
    mutationKey: ["downloadCreditTransferData"],
    mutationFn: downloadCreditTransferData,
    retry: false,
    onSuccess: () => {
      toast({
        title: "ดาวน์โหลดไฟล์สำเร็จ",
        status: "success",
        isClosable: true
      })
    },

    onError: (e) => {
      if (e) {
        toast({
          title: "ไม่สามารถดาวน์โหลดได้",
          status: "error",
          isClosable: true
        })
      }
    }
  })
  return { onDownload }
}
export default useGetDownloadData
