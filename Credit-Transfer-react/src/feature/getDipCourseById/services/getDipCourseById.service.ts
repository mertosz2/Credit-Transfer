import services from "@/config/axiosConfig";
import { ICreditTransferResponse } from "@/feature/CreditTransfer/interface/CreditTransfer";

export const getDipcourseById = async (dipCourseId: string) => {
  const response = await services.get<ICreditTransferResponse>(`/api/dip/`, {
    params: {
      dipCourseId: dipCourseId,
    },
  });
  return response.data;
};
