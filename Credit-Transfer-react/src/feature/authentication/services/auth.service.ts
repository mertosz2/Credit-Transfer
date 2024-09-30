import services from "@/config/axiosConfig"
import { ISignIn } from "../interface/auth"

export const login = async (data: ISignIn): Promise<string> => {
  const response = await services.post<string>(`api/login`, data)
  return response.data
}