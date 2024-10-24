import services from "@/configs/axiosConfig"
import { IUniCourseResponse } from "../../GetAllUniCourse/interface/GetAllUniCourse"
import { ISortUniArgs } from "../interface/SortUniCourseData"

export const sortUniCourseData = async (data: ISortUniArgs) => {
  const { key, direction, data: body } = data
  const response = await services.post<IUniCourseResponse>(
    `api/uni/sort`,
    body,
    {
      params: { key: key, direction: direction }
    }
  )
  return response.data
}
