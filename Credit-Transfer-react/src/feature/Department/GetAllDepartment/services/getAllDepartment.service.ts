import services from "@/configs/axiosConfig"
import { IGetAllDepartmentResponse } from "../interface/getAllDepartment"
import { IResponseDropDownData } from "@/feature/VocationalMange/DropdownDipCourseData/interface/dropdowndata"

export const getAllDepartment = async () => {
  const response =
    await services.get<IGetAllDepartmentResponse>(`/api/department/`)
  return response.data
}

export const getDepartmentDropdownData = async () => {
  const response = await services.get<IResponseDropDownData[]>(
    `api/department/departDd`
  )
  return response.data
}
