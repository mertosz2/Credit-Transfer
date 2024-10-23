import services from "@/configs/axiosConfig"
import { IEditDipCourseResponse } from "../interface/EditDipCourseData"

export const editDipCourseData = async (
  id: number,
  data: IEditDipCourseResponse
) => {
  const response = await services.put<IEditDipCourseResponse>(
    `api/dip/${id}`,
    data
  )
  response.data
}
