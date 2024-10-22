import services from "@/config/axiosConfig"

export const deleteUserData = async (id: number) => {
  const response = await services.delete(`api/users/${id}`)
  return response.data
}
