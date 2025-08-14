import {dataset, projectId} from '@/sanity/lib/api'
import createImageUrlBuilder from '@sanity/image-url'
import type {Image} from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image | null | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

export function urlForOpenGraphImage(image: Image | null | undefined) {
  return urlForImage(image)?.width(1200).height(627).fit('crop').url()
}

export function resolveHref(type?: string, slug?: string | null) {
  if (!type) return null
  switch (type) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : null
    case 'blogPost':
      return slug ? `/blog/${slug}` : null
    default:
      return null
  }
}
