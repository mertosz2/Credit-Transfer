import services from "@/config/axiosConfig"
import { IRoleDropdownResponse } from "../interface/RoleDropdownData"

export const roleDropdownData = async () => {
  const response = await services.get<IRoleDropdownResponse[]>(
    `api/users/roleDropdown`
  )
  return response.data
}
