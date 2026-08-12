// src/app/actions/cacheActions.ts
'use server'

import { revalidateTag } from 'next/cache'

//  Clear Cache เฉพาะรายการตาม ID
export async function revalidateRentalEstateById(id: string) {
  revalidateTag(`rental-estate-${id}`, { expire: 0 })
}

//  Clear Cache ทั้งกลุ่ม (เช่น เมื่อมีอสังหาริมทรัพย์ใหม่เพิ่มเข้ามา)
export async function revalidateAllRentalEstates() {
  revalidateTag('rental-estate-all', { expire: 0 })
}
