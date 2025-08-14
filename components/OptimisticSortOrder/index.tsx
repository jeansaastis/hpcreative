import {lazy, Suspense} from 'react'
import type {OptimisticSortOrderProps} from './index.client'

const LazyOptimisticSortOrder = lazy(() => import('./index.client'))

/**
 * Optimistic sort ordering is only used when editing the website from Sanity Studio, so it's only actually loaded in Draft Mode.
 */

export async function OptimisticSortOrder() {
  return null
}
