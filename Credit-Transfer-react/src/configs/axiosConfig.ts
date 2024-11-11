import { decodeToken } from "@/util/jwtToken"
import axios from "axios"
import Cookies from "js-cookie"
import dayjs from "dayjs"
// const baseUrl = `http://localhost:8080/`
const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`

const services = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})
export const checkExpireToken = (token: string) => {
  const userToken = decodeToken<{ exp: number }>(token)
  return dayjs() >= dayjs(userToken.exp * 1000)
}
services.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get("accessToken")

  if (accessToken) {
    const isExpired = checkExpireToken(accessToken)

    if (!isExpired) {
      config.headers!.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})
export default services
