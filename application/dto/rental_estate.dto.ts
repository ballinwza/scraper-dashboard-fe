export interface RentalEstateResponseDTO {
  id: string
  title: string
  description: string
  date_posted: string
  formal_name: string
  property_type: string
  price: number
  bedrooms: number
  bathrooms: number
  area_sqm: number
  image_url: string
  location: string
  source_url: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
}

export interface RentalEstatePaginatedResponseDTO {
  data: RentalEstateResponseDTO[]
  pagination: {
    current_page: number
    limit: number
    total_items: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface RentalEstateQueryParamsDTO {
  page?: number
  limit?: number
  search?: string
  min_price?: number
  max_price?: number
  sort_by?: string
  order?: string
}
