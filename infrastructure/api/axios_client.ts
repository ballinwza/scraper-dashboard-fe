import { container } from '@/di/container'
import { CookieService } from '@/presentation/stores/cookieService'
import axios, { InternalAxiosRequestConfig } from 'axios'

export const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URI}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Variables สำหรับจัดการ Concurrent Requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = CookieService.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config ? { ...error.config } : {}
    const isUnauthorized =
      error.response?.status === 401 || error.response?.status === 403

    if (isUnauthorized && !originalRequest._retry) {
      if (typeof window !== 'undefined') {
        // CASE 1: กำลัง Refresh Token อยู่ -> ให้เข้า Queue รอไว้
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(axiosClient(originalRequest))
              },
              reject: (err: any) => {
                reject(err)
              },
            })
          })
        }

        // CASE 2: เป็น Request แรกที่เจอ 401 -> เริ่มทำ Refresh Token
        originalRequest._retry = true
        isRefreshing = true

        try {
          const res = await container.tokenRotationUsecase.execute()

          const newAccessToken = res.accessToken
          const newRefreshToken = res.refreshToken

          if (!newAccessToken) {
            throw new Error('New access token is missing in response')
          }

          // บันทึก Token ใหม่
          CookieService.setTokens(newAccessToken, newRefreshToken)

          // ประมวลผล Queue ที่มารอทั้งหมดให้ทำงานต่อด้วย Token ใหม่
          processQueue(null, newAccessToken)

          // ยิง Request ตั้งต้นซ้ำอีกครั้ง
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosClient(originalRequest)
        } catch (refreshError) {
          // หาก Refresh Token ล้มเหลว แจ้ง Reject Queue ทั้งหมด และพาไปหน้า Login
          processQueue(refreshError, null)

          CookieService.clearTokens()
          window.location.href = '/'
          return Promise.reject(refreshError)
        } finally {
          // คืนค่า flag กลับเป็น false เสมอเมื่อทำงานเสร็จ
          isRefreshing = false
        }
      }
    }

    return Promise.reject(error)
  }
)
