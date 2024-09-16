import services from "@/config/axiosConfig"
import { ISignIn, IToken } from "../interface/auth"

export const login = async (data: ISignIn): Promise<IToken> => {
  const response = await services.post<IToken>(`api/login`, data)
  return response.data
}
