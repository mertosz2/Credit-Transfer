import services from "@/configs/axiosConfig"
import { IDepartmentData } from "../../DepartmentManipulationLanguage/interface/departmentManipulation"
import { ISearchDepartment } from "../interface/getSearchDepartmentData"
import { IGetAllDepartmentResponse } from "../../GetAllDepartment/interface/getAllDepartment"

export const searchDepartmentData = async (departmentName: IDepartmentData) => {
  const response = await services.get<IGetAllDepartmentResponse>(
    `api/department/`,
    {
      params: { departmentName: departmentName.departmentName }
    }
  )
  return response.data
}

export const departmentNextPage = async (page: number) => {
  const response = await services.get<IGetAllDepartmentResponse>(
    `api/department/`,
    {
      params: { page: page }
    }
  )
  return response.data
}

export const getNextDepartmentData = async (
  departmentName: IDepartmentData,
  page: number
) => {
  const response = await services.get<IGetAllDepartmentResponse>(
    `api/department/`,
    {
      params: {
        departmentName: departmentName.departmentName || null,
        page: page
      }
    }
  )
  return response.data
}
