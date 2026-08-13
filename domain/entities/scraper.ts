export interface ScraperEstate {
  message: string
}

export interface ScrappingEstateRequest {
  maxPage: number
  startPage: number
  targetUrl: string
}
