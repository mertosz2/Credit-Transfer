import services from "@/config/axiosConfig"
import {  ICreditTransferResponse } from "../interface/CreditTransfer"

export const getCreditTransferData = async(): Promise<ICreditTransferResponse[]> => {
    const response = await services.get<ICreditTransferResponse[]>(`api/transfer/ttp`)
    return response.data
}

export const getTransferable = async(data:ICreditTransferResponse[]) =>{
    const response = await services.post<ICreditTransferResponse[]>(`/api/transfer/transfer-check`, data)
    return response.data
}
export const sortData = async(data: ICreditTransferResponse[], sortBy: string, ascending: boolean) => {
    const response = await services.post<ICreditTransferResponse[]>('/sort', {
        responseList: data,
        sortBy: sortBy,
        ascending: ascending
    });
    return response.data;
};