import services from "@/configs/axiosConfig"
import { IDipCourseRespone } from "@/feature/getAllDipCourse/interface/getAllDipCourse"
import { ISearchDipResponse } from "../interface/SearchDipCourseData"

export const searchDipCourseData = async (data: ISearchDipResponse) => {
  const { dipCourseId, dipCourseName, uniCourseId, uniCourseName, dipCredit } =
    data
  const response = await services.get<IDipCourseRespone>(`/api/dip/search`, {
    params: {
      dipCourseId: dipCourseId,
      dipCourseName: dipCourseName,
      uniCourseId: uniCourseId,
      uniCourseName: uniCourseName,
      dipCredit: dipCredit
    }
  })
  return response.data
}

export const getSearchDipCourseData = async () => {
  const response = await services.get<IDipCourseRespone>(`/api/dip/search`)
  return response.data
}

export const getNextSearchDipCourseData = async (
  data: ISearchDipResponse,
  page: number
) => {
  const { dipCourseId, dipCourseName, uniCourseId, uniCourseName, dipCredit } =
    data
  const response = await services.get<IDipCourseRespone>(`/api/dip/search`, {
    params: {
      dipCourseId: dipCourseId,
      dipCourseName: dipCourseName,
      uniCourseId: uniCourseId,
      uniCourseName: uniCourseName,
      dipCredit: dipCredit,
      page: page
    }
  })
  return response.data
}
