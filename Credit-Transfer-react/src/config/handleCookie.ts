import Cookies from "js-cookie"

export const onSetCookie = ({ jwt }: { jwt: string }) => {
  Cookies.set("accessToken", jwt)
}

export const onRemoveCookie = () => {
  Cookies.remove("accessToken")
  Cookies.remove("refreshToken")
}

export const onSetGetStartedCookie = (value: string) => {
  Cookies.set("getStarted", value)
}

export const onRemoveGetStartedCookie = () => {
  Cookies.remove("getStarted")
}
