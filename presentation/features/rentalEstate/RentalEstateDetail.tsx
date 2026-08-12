'use client'

import { formatTHDate } from '@/shared/utils/formatDate'
import { formatTHPrice } from '@/shared/utils/formatPrice'
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  ExternalLink,
  Globe,
  MapPin,
  Maximize2,
  Tag,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface RentalEstateDetailProps {
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

export default function RentalEstateDetail(props: RentalEstateDetailProps) {
  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/rental-estate"
            className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ย้อนกลับ</span>
          </Link>
          <span className="text-xs text-slate-400 dark:text-slate-600">/</span>
          <span className="text-xs font-mono text-teal-600 bg-teal-50 border border-teal-200 dark:text-teal-400 dark:bg-teal-500/10 dark:border-teal-500/20 px-2 py-0.5 rounded">
            ID: {props.id}
          </span>
        </div>

        {/* Source Link */}
        <a
          href={props.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:border-teal-500/30 dark:text-teal-400 dark:hover:bg-teal-500/20 transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>ดูต้นทางบน DotProperty</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Cover Image */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-video group shadow-sm">
            <Image
              src={props.image_url}
              alt={props.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/60 flex items-center space-x-1 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>{props.property_type}</span>
            </div>
          </div>

          {/* Core Info & Specs */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {props.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{props.location}</span>
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800 py-4 my-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-cyan-600 dark:bg-slate-800/80 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/50">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ห้องนอน
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {props.bedrooms} Studio/Bed
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-teal-600 dark:bg-slate-800/80 dark:text-teal-400 border border-slate-200 dark:border-slate-700/50">
                  <Bath className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ห้องน้ำ
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {props.bathrooms} Room
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-indigo-600 dark:bg-slate-800/80 dark:text-indigo-400 border border-slate-200 dark:border-slate-700/50">
                  <Maximize2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    พื้นที่ใช้สอย
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {props.area_sqm} ตร.ม.
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                รายละเอียดเพิ่มเติม
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80">
                {props.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Scraper Metadata */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ราคาเช่าประจำเดือน
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                ฿{formatTHPrice(props.price)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                / เดือน
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>ประเภทโครงการ</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {props.formal_name}
              </span>
            </div>
          </div>

          {/* Scraper Metadata Details Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 flex items-center space-x-2">
              <Tag className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>ข้อมูลการจัดเก็บ (Scraper Metadata)</span>
            </h3>

            <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  วันประกาศจริง
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-mono">
                  {formatTHDate(props.date_posted)}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  พิกัด Latitude
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-mono">
                  {props.latitude}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  พิกัด Longitude
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-mono">
                  {props.longitude}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  สแกนเก็บข้อมูลเมื่อ
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-mono">
                  {formatTHDate(props.created_at)}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  อัปเดตข้อมูลล่าสุด
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-mono">
                  {formatTHDate(props.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
