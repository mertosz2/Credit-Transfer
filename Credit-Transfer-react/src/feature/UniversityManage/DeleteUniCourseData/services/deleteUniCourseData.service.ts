import services from "@/configs/axiosConfig"

export const deleteUniCourseData = async (id: number) => {
  const response = await services.delete(`api/uni/${id}`)
  return response.data
}
