import { useMutation } from "@tanstack/react-query"
import { sortData } from "../services/CreditTransfer.service"
import { useToast } from "@chakra-ui/react"

const useSortData = () => {
  const toast = useToast()
  const { mutateAsync: onSortData, isPending: isSorting } = useMutation({
    mutationKey: ["sortData"],
    mutationFn: sortData,
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

  return { onSortData, isSorting }
}

export default useSortData
