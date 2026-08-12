import { unstable_cache as nextUnstableCache } from 'next/cache'
import { CACHE_CONFIG } from '../config/cache.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<T> = (...args: any[]) => Promise<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCachedUseCase<T extends Callback<any>>(
  cb: T,
  keyParts: string[],
  options?: {
    revalidate?: number | false
    tags?: string[]
  }
) {
  return nextUnstableCache(cb, keyParts, {
    revalidate: options?.revalidate ?? CACHE_CONFIG.DEFAULT_REVALIDATE,
    tags: options?.tags,
  })
}
