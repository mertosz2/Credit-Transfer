import Cookies from "js-cookie"

export const onSetCookie = ({ jwt }: { jwt: string }) => {
  //Cookies.set("accessToken", jwt, { expires: 30 / 60 / 60 / 24 })
  Cookies.set("accessToken", jwt, { expires: 30 / (60 * 60 * 24) })
}

export const onRemoveCookie = () => {
  Cookies.remove("accessToken")
}

