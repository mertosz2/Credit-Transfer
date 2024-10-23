import services from "@/configs/axiosConfig"
import { IAddUniCourseResponse } from "../interface/AddUniCourseData"
import { IResponseDropDownData } from "@/feature/VocationalMange/DropdownDipCourseData/interface/dropdowndata"

export const addUniCourseData = async (data: IAddUniCourseResponse) => {
  const response = await services.post<IAddUniCourseResponse>(`api/uni`, data)
  return response.data
}

export const getCreateUniCourseDropdown = async () => {
  const response =
    await services.get<IResponseDropDownData[]>(`api/uni/uniEDropdown`)
  return response.data
}
