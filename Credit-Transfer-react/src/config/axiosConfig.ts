import axios from 'axios';
import dayjs from "dayjs"
import Cookies from "js-cookie"


const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`

const services = axios.create({
    baseURL: baseUrl,
    headers:{
        "Content-Type": "application/json"
    },
    withCredentials: true
})
export const checkExpireToken = (token: string) => {
    const userToken = decodeToken<{ exp: number }>(token)
    return dayjs() >= dayjs(userToken.exp * 1000)
  }

services.interceptors.request.use(async (config: { headers: any }) =>{
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



