// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/rental-estate',
]
const authRoutes = ['/', '/register']

export function middleware(request: NextRequest) {
  // ดึงข้อมูล Cookie ชื่อ 'token' (หรือเปลี่ยนชื่อตาม Cookie ที่ใช้จริง)
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value
  const { pathname } = request.nextUrl

  const hasSession = Boolean(accessToken || refreshToken)

  // เช็คประเภทของ Route ปัจจุบัน
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/' // เช็คว่าต้องเป็นหน้าแรกเป๊ะๆ เท่านั้น
    }
    return pathname.startsWith(route)
  })

  // เคสที่ 1: พยายามเข้าหน้า Protected แต่ยังไม่ได้ Login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/', request.url)
    // แนบ Query Parameter 'from' ไปด้วย เพื่อให้ Redirect กลับมาหน้าเดิมหลัง Login สำเร็จ
    loginUrl.searchParams.set('from', pathname)

    return NextResponse.redirect(loginUrl)
  }

  // เคสที่ 2: Login แล้ว แต่พยายามกลับไปเข้าหน้า Login / Register อีก
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ถ้าไม่มีเงื่อนไขใดติดขัด อนุญาตให้ไปต่อได้ตามปกติ
  return NextResponse.next()
}

// 3. กำหนด Matcher เพื่อจำกัดขอบเขตการทำงานของ Middleware
export const config = {
  matcher: [
    /*
     * Match ทั้งหมด ยกเว้น:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, ฯลฯ)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
