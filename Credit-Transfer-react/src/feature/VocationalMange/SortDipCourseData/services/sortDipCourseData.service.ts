import services from "@/configs/axiosConfig"
import { IDipCourseRespone } from "@/feature/getAllDipCourse/interface/getAllDipCourse"
import { ISortDipArgs } from "../interface/SortDipCourseData"

export const sortDipCourseData = async (data: ISortDipArgs) => {
  const { key, direction, data: body } = data
  const response = await services.post<IDipCourseRespone>(
    `api/dip/sort`,
    body,
    {
      params: {
        key: key,
        direction: direction
      }
    }
  )
  return response.data
}
