import services from "@/config/axiosConfig"
import { IEditUniCourseResponse } from "../interface/EditUniCourseData"

export const editUniCourseData = async (
  id: number,
  data: IEditUniCourseResponse
) => {
  const response = await services.put<IEditUniCourseResponse>(
    `api/uni/${id}`,
    data
  )
  return response.data
}
