import services from "@/configs/axiosConfig"
import { ICreditTransferResponse } from "@/feature/CreditTransfer/interface/CreditTransfer"

export const downloadCreditTransferData = async (
  data: ICreditTransferResponse[]
): Promise<Blob> => {
  const response = await services.post(`/api/transfer/exportExcel`, data, {
    responseType: "blob"
  })
  return response.data
}
