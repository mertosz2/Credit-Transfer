import services from "@/config/axiosConfig"
import {  ICreditTransferResponse } from "../interface/CreditTransfer"

export const getCreditTransferData = async(): Promise<ICreditTransferResponse[]> => {
    const response = await services.get<ICreditTransferResponse[]>(`api/transfer/ttp`)
    return response.data
}