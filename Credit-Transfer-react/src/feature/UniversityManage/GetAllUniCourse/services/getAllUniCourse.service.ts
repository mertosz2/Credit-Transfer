import services from "@/configs/axiosConfig"
import {
  ISearchUniResponse,
  IUniCourseResponse
} from "../interface/GetAllUniCourse"

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

export const searchUniCourseData = async (data: ISearchUniResponse) => {
  const { uniCourseId, uniCourseName, courseCategory, uniCredit, preSubject } =
    data
  const response = await services.get<IUniCourseResponse>(`/api/uni/search`, {
    params: {
      uniCourseId: uniCourseId || null,
      uniCourseName: uniCourseName || null,
      courseCategory: courseCategory || null,
      uniCredit: uniCredit || null,
      preSubject: preSubject || null
    }
  })
  return response.data
}

export const getSearchUniCourseData = async () => {
  const response = await services.get<IUniCourseResponse>(`/api/uni/search`)
  return response.data
}

export const getNextSearchUniCourseData = async (
  data: ISearchUniResponse,
  page: number
) => {
  const { uniCourseId, uniCourseName, courseCategory, uniCredit, preSubject } =
    data
  const response = await services.get<IUniCourseResponse>(`/api/uni/search`, {
    params: {
      uniCourseId: uniCourseId || null,
      uniCourseName: uniCourseName || null,
      courseCategory: courseCategory || null,
      uniCredit: uniCredit || null,
      preSubject: preSubject || null,
      page: page
    }
  })
  return response.data
}
