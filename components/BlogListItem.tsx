// components/BlogListItem.tsx
'use client'

import type {PortableTextBlock} from 'next-sanity'
import Link from 'next/link'
import {CustomPortableText} from './CustomPortableText'
import ImageBox from './ImageBox'

export interface BlogPostListItemProps {
  post: {
    _id: string
    _type: string
    slug: string
    title: string
    publishedAt?: string
    coverImage?:
      | {
          asset?: {url?: string} // if you project url in GROQ
        }
      | any
    overview?: PortableTextBlock[]
    tags?: string[]
  }
}

export function BlogListItem({post}: BlogPostListItemProps) {
  const {slug, title, publishedAt, coverImage, overview, tags} = post
  const href = `/blog/${encodeURIComponent(slug)}`

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border hover:shadow-lg transition-shadow"
    >
      {/* Cover image */}
      {coverImage && (
        <div className="relative aspect-[16/9] w-full">
          <ImageBox
            image={coverImage}
            alt={`Cover for ${title}`}
            classesWrapper="rounded-t-lg object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}

      <div className="p-4">
        {/* Title + date */}
        <h3 className="text-xl font-bold group-hover:text-blue-600">{title}</h3>
        {publishedAt && (
          <time className="block text-sm text-gray-500">
            {new Date(publishedAt).toLocaleDateString()}
          </time>
        )}

        {/* Overview snippet */}
        {overview && (
          <div className="mt-2 text-gray-700 prose-sm">
            {overview && <CustomPortableText id={null} type={null} path={[]} value={overview} />}
          </div>
        )}

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-800">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
