export interface RentalEstate {
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

export interface RentalEstateQueryFilters {
  page?: number
  limit?: number
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedRentalEstates {
  items: RentalEstate[]
  total: number
  page: number
  limit: number
  totalPages: number
}
