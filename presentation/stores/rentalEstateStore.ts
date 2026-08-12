import {
  RentalEstate,
  RentalEstateQueryFilters,
} from '@/domain/entities/rental_estate'
import { create } from 'zustand'

interface RentalEstateState {
  selectedEstate: RentalEstate | null
  setSelectedEstate: (estate: RentalEstate | null) => void

  // Filter
  filters: RentalEstateQueryFilters
  setFilters: (filters: Partial<RentalEstateQueryFilters>) => void
  resetFilters: () => void
}

const initialFilters: RentalEstateQueryFilters = {
  page: 1,
  limit: 10,
  search: '',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: 'created_at',
  order: 'asc',
}

export const useRentalEstateStore = create<RentalEstateState>((set) => ({
  selectedEstate: null,
  setSelectedEstate: (estate) => set({ selectedEstate: estate }),

  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}))
