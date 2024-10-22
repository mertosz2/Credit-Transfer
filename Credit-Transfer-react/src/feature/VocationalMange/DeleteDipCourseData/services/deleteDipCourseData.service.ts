import services from "@/config/axiosConfig"

export const deleteDipCourseData = async (id: number) => {
  const response = await services.delete(`api/dip/${id}`)
  response.data
}
