import { useQuery } from "@tanstack/react-query";
import { getCreditTransferData } from "../services/CreditTransfer.service";
import { useToast } from "@chakra-ui/react";

const useGetCreditTransfer = () => {
  const toast = useToast();
  const {data: creditTransferData} = useQuery({
    queryKey: ["getCreditTransferData"],
    queryFn: async () => {
      try {
        return await getCreditTransferData();
      } catch (error) {
        if (typeof (error as Error)?.message === "string") {
          toast({
            title: (error as Error).message,
            status: "error",
            isClosable: true,
          });
        }
      }
    },

    retry: false,
  });
  return {creditTransferData};
};
export default useGetCreditTransfer;
