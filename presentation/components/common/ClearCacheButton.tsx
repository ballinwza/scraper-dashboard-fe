'use client'

import { revalidateRentalEstateById } from '@/app/actions/cacheAction'
import { useTransition } from 'react'

// TODO: มาจัดการทีหลัง
export function EditEstateForm({ estateId }: { estateId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleUpdateData = async () => {
    // 1. ยิง API อัปเดตข้อมูลไปยัง Backend
    // await updateEstateDataApi(estateId, { /* new data */ });

    // 2. สั่ง Clear Cache บน Next.js Server
    startTransition(async () => {
      await revalidateRentalEstateById(estateId)
      alert('อัปเดตข้อมูลและล้าง Cache เรียบร้อย!')
    })
  }

  return (
    <button onClick={handleUpdateData} disabled={isPending}>
      {isPending ? 'กำลังอัปเดต...' : 'บันทึกข้อมูล'}
    </button>
  )
}
