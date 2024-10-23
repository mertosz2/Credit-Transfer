import services from "@/configs/axiosConfig"
import { IUniCourseDropdownResponse } from "../interface/UniCourseDropdownData"

export const uniCourseDropdownData = async () => {
  const response =
    await services.get<IUniCourseDropdownResponse[]>(`api/uni/uniCDropdown`)
  return response.data
}
