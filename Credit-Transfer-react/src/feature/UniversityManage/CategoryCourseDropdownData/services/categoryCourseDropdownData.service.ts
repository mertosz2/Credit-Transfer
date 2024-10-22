import services from "@/config/axiosConfig"
import { ICategoryCourseDropdownResponse } from "../interface/CategoryCourseDropdownData"

export const categoryCourseDropdownData = async () => {
  const response =
    await services.get<ICategoryCourseDropdownResponse[]>(`api/uni/ccDropdown`)
  return response.data
}
