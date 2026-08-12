'use client'

import { useRentalEstateStore } from '@/presentation/stores/rentalEstateStore'
import { LayoutGrid, List, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import CardContentComponent from '../components/common/CardContent'
import { ErrorState } from '../components/common/ErrorState'
import { useRentalEstates } from '../hooks/useRentalEstate'

export const RentalEstateClient = () => {
  const { filters, setFilters } = useRentalEstateStore()
  const { data, isError } = useRentalEstates(filters)

  // View Mode: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Local State สำหรับ Form Search (กดปุ่มก่อนค่อยยิง Filter)
  const [searchInput, setSearchInput] = useState(filters.search || '')
  const [minPriceInput, setMinPriceInput] = useState(
    filters.minPrice?.toString() || ''
  )
  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice?.toString() || ''
  )

  // เมื่อกดปุ่มค้นหา หรือ Submit Form
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFilters({
      search: searchInput,
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined,
      page: 1, // รีเซ็ตกลับไปหน้า 1 เมื่อค้นหาใหม่
    })
  }

  if (isError) {
    return <ErrorState />
  }

  const totalPages = data?.totalPages || 1
  const currentPage = filters.page || 1

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* --- Filter & Search Section --- */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            type="text"
            placeholder="Search estates..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-32 px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-32 px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Search className="w-4 h-4" />
            ค้นหา
          </button>
        </form>

        {/* --- View Mode Switcher --- */}
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Table View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Data Display Section --- */}
      {viewMode === 'grid' ? (
        /* --- Grid View (Card) --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((estate) => (
            <Link
              key={estate.id}
              href={`/rental-estate/${estate.id}`}
              className="group border rounded-lg shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Card Image */}
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {estate.image_url ? (
                  <Image
                    src={estate.image_url}
                    alt={estate.title}
                    fill
                    unoptimized
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Card Content */}
              <CardContentComponent
                title={estate.title}
                description={estate.description}
                price={estate.price}
                location={estate.location}
              />
            </Link>
          ))}
        </div>
      ) : (
        /* --- Table View --- */
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                <th className="p-3 w-20">รูปภาพ</th>
                <th className="p-3">ชื่อรายการ</th>
                <th className="p-3">สถานที่</th>
                <th className="p-3">ราคา</th>
                <th className="p-3 text-right">แอคชัน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.items.map((estate) => (
                <tr
                  key={estate.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="p-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {estate.image_url && (
                        <Image
                          src={estate.image_url}
                          alt={estate.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/rental-estate/${estate.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {estate.title}
                    </Link>
                  </td>
                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                    {estate.location}
                  </td>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">
                    ฿{estate.price.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/rental-estate/${estate.id}`}
                      className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Pagination Section --- */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {/* เลือกจำนวนแสดงผลต่อหน้า (Limit) */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>แสดง</span>
          <select
            value={filters.limit || 10}
            onChange={(e) =>
              setFilters({ limit: Number(e.target.value), page: 1 })
            }
            className="px-2 py-1 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>รายการต่อหน้า</span>
        </div>

        {/* ปุ่มควบคุมหน้า (Prev/Next & Dropdown เลือกหน้า) */}
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setFilters({ page: currentPage - 1 })}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span>หน้า</span>
            <select
              value={currentPage}
              onChange={(e) => setFilters({ page: Number(e.target.value) })}
              className="px-2 py-1 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    {pageNum}
                  </option>
                )
              )}
            </select>
            <span>จาก {totalPages}</span>
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setFilters({ page: currentPage + 1 })}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
