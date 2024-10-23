import services from "@/configs/axiosConfig"
import {
  ICreditTransferResponse,
  IDataSection,
  ISortArgs
} from "../interface/CreditTransfer"

export const getCreditTransferData = async (): Promise<
  ICreditTransferResponse[]
> => {
  const response =
    await services.get<ICreditTransferResponse[]>(`api/transfer/ttp`)
  return response.data
}

export const getTransferable = async (data: ICreditTransferResponse[]) => {
  const response = await services.post<IDataSection>(
    `/api/transfer/report`,
    data
  )
  return response.data
}

export const sortData = async (data: ISortArgs) => {
  const { key, direction, data: body } = data
  const response = await services.post<ICreditTransferResponse[]>(
    `/api/transfer/sort`,
    body,
    {
      params: {
        key: key,
        direction: direction
      }
    }
  )
  return response.data
}
