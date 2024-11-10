import services from "@/configs/axiosConfig"

export const deleteDipCourseData = async (id: number) => {
  const response = await services.delete(`api/dip/${id}`)
  return response.data
}
