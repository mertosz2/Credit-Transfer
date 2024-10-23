import services from "@/configs/axiosConfig"
import { ICategoryCourseDropdownResponse } from "../interface/CategoryCourseDropdownData"

export const categoryCourseDropdownData = async () => {
  const response =
    await services.get<ICategoryCourseDropdownResponse[]>(`api/uni/ccDropdown`)
  return response.data
}
