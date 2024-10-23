import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")
  const { pathname } = request.nextUrl

  if (accessToken) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/transfer", request.url))
    }
  }
  if (!accessToken) {
    if (pathname === "/transfer") {
      return NextResponse.next()
    }
    if (pathname === "/vocationalmanage") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname === "/manageaccount") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (pathname === "/universitymanage") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }
  return NextResponse.next()
}
