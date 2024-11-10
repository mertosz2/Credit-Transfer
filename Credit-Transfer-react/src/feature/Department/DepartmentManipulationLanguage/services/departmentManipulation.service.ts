import services from "@/configs/axiosConfig"
import { IDepartmentData } from "../interface/departmentManipulation"
import {
  IDepartmentResponseList,
  IGetAllDepartmentResponse
} from "../../GetAllDepartment/interface/getAllDepartment"

export const addDepartmentData = async (departmentName: IDepartmentData) => {
  const response = await services.post<IDepartmentResponseList>(
    `api/department`,
    departmentName
  )
  return response.data
}
export const editDepartmentData = async (
  id: number,
  departmentName: IDepartmentData
) => {
  const response = await services.put<IDepartmentResponseList>(
    `api/department/${id}`,
    departmentName
  )
  return response.data
}

export const deleteDepartmentById = async (id: number) => {
  const response = await services.delete(`api/department/${id}`)
  return response.data
}
