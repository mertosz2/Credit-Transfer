import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")
  const { pathname } = request.nextUrl

  // NOTE: If the pathname is accessible, add here

  if (accessToken) {
    if (pathname === "/") {
      // if already authenticated, redirect to /transfer
      return NextResponse.redirect(new URL("/transfer", request.url))
    }
    // เพิ่มเช็คว่าถ้าอยู่หน้า /transfer แล้วไม่ต้อง redirect อีก
    if (pathname === "/transfer") {
      return NextResponse.next() // allow access to /transfer if token exists
    }
  }

  return NextResponse.next() // allow all other cases
}
