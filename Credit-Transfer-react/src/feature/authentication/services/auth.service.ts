import services from "@/configs/axiosConfig"
import { ISignIn } from "../interface/auth"

export const login = async (data: ISignIn) => {
  const response = await services.post<string>(`/api/login`, data)
  return response.data
}
