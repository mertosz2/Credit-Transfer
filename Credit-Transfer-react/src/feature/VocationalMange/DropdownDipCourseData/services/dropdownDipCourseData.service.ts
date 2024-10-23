import services from "@/configs/axiosConfig"
import { IResponseDropDownData } from "../interface/dropdowndata"

export const getDropDownDipCourseData = async () => {
  const response =
    await services.get<IResponseDropDownData[]>(`/api/uni/uniDropdown`)
  return response.data
}
