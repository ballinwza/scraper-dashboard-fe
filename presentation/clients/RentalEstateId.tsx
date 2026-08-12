'use client'

import { EmptyState } from '@/presentation/components/common/EmptyState'
import { useRentalEstateDetail } from '@/presentation/hooks/useRentalEstate'
import RentalEstateDetail from '../features/rentalEstate/RentalEstateDetail'

export default function RentalEstateId({ id }: { id: string }) {
  const { data } = useRentalEstateDetail(id)
  if (!data) {
    return (
      <EmptyState
        title="ไม่พบข้อมูลอสังหาริมทรัพย์"
        description="ไม่มีข้อมูลที่คุณต้องการ หรือรายการนี้อาจถูกลบไปแล้ว"
      />
    )
  }

  return (
    <RentalEstateDetail
      id={data.id}
      title={data.title}
      description={data.description}
      date_posted={data.date_posted}
      formal_name={data.formal_name}
      property_type={data.property_type}
      price={data.price}
      bedrooms={data.bedrooms}
      bathrooms={data.bathrooms}
      area_sqm={data.area_sqm}
      image_url={data.image_url}
      location={data.location}
      source_url={data.source_url}
      latitude={data.latitude}
      longitude={data.longitude}
      created_at={data.created_at}
      updated_at={data.updated_at}
    />
  )
}
