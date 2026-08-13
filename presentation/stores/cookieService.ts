import Cookies from 'js-cookie'

export class CookieService {
  private static ACCESS_TOKEN_KEY = 'access_token'
  private static REFRESH_TOKEN_KEY = 'refresh_token'

  static setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
      expires: 15 / 1440, // Min=1440 , Hr=24
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    })
    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    })
  }

  static getAccessToken(): string | undefined {
    return Cookies.get(this.ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get(this.REFRESH_TOKEN_KEY)
  }

  static clearTokens() {
    Cookies.remove(this.ACCESS_TOKEN_KEY, { path: '/' })
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: '/' })
  }
}
