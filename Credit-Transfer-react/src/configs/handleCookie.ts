import Cookies from "js-cookie"

export const onSetCookie = ({ jwt }: { jwt: string }) => {
  Cookies.set("accessToken", jwt)
}

export const onRemoveCookie = () => {
  Cookies.remove("accessToken")
}
