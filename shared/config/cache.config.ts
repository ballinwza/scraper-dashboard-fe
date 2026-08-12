export const CACHE_CONFIG = {
  DEFAULT_REVALIDATE: 300,
  SHORT_REVALIDATE: 60, // 1 นาที (สำหรับข้อมูลที่เปลี่ยนบ่อย)
  LONG_REVALIDATE: 3600, // 1 ชั่วโมง (สำหรับข้อมูลที่ไม่ค่อยเปลี่ยน)
} as const
