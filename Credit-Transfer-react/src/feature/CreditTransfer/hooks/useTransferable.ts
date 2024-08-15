import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IResponseAPI } from "@/interfaces/errorType";
import { getTransferable } from "../services/creditTransfer.service";

const useTransferable = () => {
  const toast = useToast();
  const { mutateAsync: onTransferable } = useMutation({
    mutationKey: ["getTransferable"],
    mutationFn: getTransferable,
    retry: false,
    onSuccess: () => {
      toast({
        title: "Success",
        status: "success",
        isClosable: true,
      });
    },

    onError: (e) => {
            if (e) {
              toast({
                title: e.message,
                status: "error",
                isClosable: true,
              });
            }
          },
        });
  return { onTransferable };
};

export default useTransferable;
