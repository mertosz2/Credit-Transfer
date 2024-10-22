import services from "@/config/axiosConfig"
import { IUniCourseResponse } from "../interface/GetAllUniCourse"

export const getAllUniCourse = async () => {
  const response = await services.get<IUniCourseResponse>(`/api/uni`)
  return response.data
}

export const uniNextPage = async (page: number) => {
  const response = await services.get<IUniCourseResponse>(`/api/uni`, {
    params: { page: page }
  })
  return response.data
}
