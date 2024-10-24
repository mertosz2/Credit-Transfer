import { useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IResponseAPI } from "@/interfaces/errorType"
import { getTransferable } from "../services/CreditTransfer.service"

const useTransferable = () => {
  const toast = useToast()
  const { mutateAsync: onTransferable } = useMutation({
    mutationKey: ["getTransferable"],
    mutationFn: getTransferable,
    retry: false,

    onError: (e) => {
      if (e) {
        toast({
          title: e.message,
          status: "error",
          isClosable: true
        })
      }
    }
  })
  return { onTransferable }
}

export default useTransferable
