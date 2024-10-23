import services from "@/configs/axiosConfig"

export const deleteUserData = async (id: number) => {
  const response = await services.delete(`api/users/${id}`)
  return response.data
}
