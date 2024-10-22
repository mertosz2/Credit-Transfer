import services from "@/config/axiosConfig"
import { IEditUserResponse } from "../interface/EditUserData"

export const editUserData = async (id: number, data: IEditUserResponse) => {
  const response = await services.put<IEditUserResponse>(
    `api/users/${id}`,
    data
  )
  return response.data
}
