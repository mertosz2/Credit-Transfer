import services from "@/configs/axiosConfig"
import { IAddDipCourseResponse } from "../interface/AddDipcourseData"

export const addDipCourseData = async (data: IAddDipCourseResponse) => {
  const response = await services.post<IAddDipCourseResponse>(`/api/dip`, data)
  return response.data
}
