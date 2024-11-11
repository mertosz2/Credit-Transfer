import services from "@/configs/axiosConfig"
import { ICreditTransferResponse } from "@/feature/CreditTransfer/interface/CreditTransfer"

export const getDipcourseById = async (dipCourseId: string) => {
  const response = await services.get<ICreditTransferResponse>(`/api/transfer/`, {
    params: {
      dipCourseId: dipCourseId
    }
  })
  return response.data
}
