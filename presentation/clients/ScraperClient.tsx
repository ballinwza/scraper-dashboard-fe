'use client'

import { ScrappingEstateRequest } from '@/domain/entities/scraper'
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Hash,
  Loader2,
  Play,
} from 'lucide-react'
import React, { useState } from 'react'
import { useScraper } from '../hooks/useScrape'

export default function ScrapeFormClient() {
  const [targetUrl, setTargetUrl] = useState(
    'https://www.dotproperty.co.th/en/condos-for-rent/bangkok'
  )
  const [startPage, setStartPage] = useState<number>(1)
  const [maxPage, setMaxPage] = useState<number>(10)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // เรียกใช้ Hook useScraper
  const { message, scrappingEstate, isAnswerLoading } = useScraper()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!targetUrl.trim()) {
      setErrorMessage('กรุณากรอก URL ที่ต้องการ Scrape ข้อมูล')
      return
    }

    if (startPage < 1 || maxPage < 1 || startPage > maxPage) {
      setErrorMessage(
        'กรุณาตรวจสอบจำนวนหน้า (หน้าเริ่มต้นต้องน้อยกว่าหรือเท่ากับหน้าสูงสุด)'
      )
      return
    }

    try {
      const payload: ScrappingEstateRequest = {
        targetUrl: targetUrl.trim(),
        startPage,
        maxPage,
      }

      // เรียกใช้งานฟังก์ชัน scrappingEstate จาก hook
      await scrappingEstate(payload)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการส่งคำขอ Scrape ข้อมูล')
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
          Scrape Rental Estates Data
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          กำหนดเงื่อนไข URL และช่วงหน้าที่ต้องการดึงข้อมูลอสังหาริมทรัพย์
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Target URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Target URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="url"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://www.dotproperty.co.th/en/condos-for-rent/bangkok"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Start Page & Max Page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Start Page <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="number"
                min={1}
                required
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Max Page <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="number"
                min={1}
                required
                value={maxPage}
                onChange={(e) => setMaxPage(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Success Alert (ดึงค่า message ที่ได้จาก useScraper) */}
        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnswerLoading}
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnswerLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังประมวลผลคำขอ...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              เริ่มดึงข้อมูล (Start Scrape)
            </>
          )}
        </button>
      </form>
    </div>
  )
}
