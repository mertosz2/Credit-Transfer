import services from "@/configs/axiosConfig"
import { IDipCourseRespone } from "../interface/getAllDipCourse"

export const getAllDipCourse = async () => {
  const response = await services.get<IDipCourseRespone>(`/api/dip`)
  return response.data
}

export const getNextDipCourse = async (page: number) => {
  const response = await services.get<IDipCourseRespone>(`/api/dip/search`, {
    params: { page: page }
  })
  return response.data
}
