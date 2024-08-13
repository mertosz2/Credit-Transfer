import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { UploadFileCreditTransfer } from "../services/UploadFileCreditTransfer.service";
import { AxiosError } from "axios";
import { IResponseAPI } from "@/interfaces/errorType";

const useGetUploadFileCreditTransfer = () => {
  const toast = useToast();
  const { mutateAsync: onUploadFile, isPending } = useMutation({
    mutationKey: ["UploadFIleCreditTransfer"],
    mutationFn: UploadFileCreditTransfer,
    retry: false,
    onSuccess: () => {
      toast({
        title: "Import File Success",
        status: "success",
        isClosable: true,
      });
      console.log();
    },

    onError: (e: AxiosError<IResponseAPI>) => {
      if (e.response) {
        toast({
          title: e.response.data.message,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  return { onUploadFile, isPending };
};

export default useGetUploadFileCreditTransfer;
