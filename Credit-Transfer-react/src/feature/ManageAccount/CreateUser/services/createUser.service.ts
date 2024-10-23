import services from "@/configs/axiosConfig"
import { ICreateUserResponse } from "../interface/CreateUser"

export const createUser = async (data: ICreateUserResponse) => {
  const response = await services.post<ICreateUserResponse>(`api/users`, data)
  return response.data
}
