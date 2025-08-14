import ImageBox from '@/components/ImageBox'
import {resolveHref} from '@/sanity/lib/utils'
import Link from 'next/link'

type BlogCardPost = {
  _id: string
  _type: 'blogPost'
  slug?: string | null
  title?: string
  publishedAt?: string
  publisher?: string
  coverImage?: any
  overview?: string
  tags?: string[]
  externalUrl?: string
  cardVariant?: 'standard' | 'imageLink'
}

export default function BlogCard({post}: {post: BlogCardPost}) {
  const {_type, slug, title, publishedAt, publisher, coverImage, tags, externalUrl} = post

  // Format date
  const date = publishedAt ? new Date(publishedAt) : null
  const formatted = date
    ? date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})
    : null

  // Where to link
  const internalHref = resolveHref(_type, slug || null)
  const href = internalHref || externalUrl || '#'

  return (
    <Link
      href={href}
      target={externalUrl ? '_blank' : undefined}
      rel={externalUrl ? 'noopener noreferrer' : undefined}
      className="relative rounded-md overflow-hidden group h-64 block"
    >
      {/* Background Image */}
      {coverImage && (
        <ImageBox
          image={coverImage}
          alt={title || ''}
          classesWrapper="absolute inset-0"
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        {title && <h3 className="text-xl font-bold leading-tight drop-shadow">{title}</h3>}
        {(formatted || publisher) && (
          <p className="mt-1 text-sm text-gray-200 opacity-90">
            {[formatted, publisher].filter(Boolean).join(' • ')}
          </p>
        )}
        {tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-xs bg-black/50 px-2 py-0.5 rounded text-gray-100">
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
