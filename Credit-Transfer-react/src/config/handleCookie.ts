import Cookies from "js-cookie"

export const onSetCookie = ({ jwt }: { jwt: string }) => {
  Cookies.set("accessToken", jwt)
  Cookies.set("accessToken", jwt, { expires: 1 / 288 })
}

export const onRemoveCookie = () => {
  Cookies.remove("accessToken")
}

export const onSetGetStartedCookie = (value: string) => {
  Cookies.set("getStarted", value)
}

export const onRemoveGetStartedCookie = () => {
  Cookies.remove("getStarted")
}
