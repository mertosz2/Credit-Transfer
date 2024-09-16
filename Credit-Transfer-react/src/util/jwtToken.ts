import { jwtDecode } from "jwt-decode"

export const decodeToken = <T>(token: string): T => {
  return jwtDecode<T>(token)
}
