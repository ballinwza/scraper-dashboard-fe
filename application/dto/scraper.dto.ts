export interface ScraperEstateReqDTO {
  target_url: string
  max_page: number
  start_page: number
}

export interface ScraperEstateResDTO {
  data: string
  message: string
  status: number
}
