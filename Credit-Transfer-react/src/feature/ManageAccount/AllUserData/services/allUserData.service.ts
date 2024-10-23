import services from "@/configs/axiosConfig"
import { IAllUserResponse } from "../interface/AllUserData"

export const allUserData = async () => {
  const response = await services.get<IAllUserResponse>(`api/users`)
  return response.data
}

export const getNextUser = async (page: number) => {
  const response = await services.get<IAllUserResponse>("api/users", {
    params: { page: page }
  })
  return response.data
}
