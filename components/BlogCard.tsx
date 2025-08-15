import Image from 'next/image'

type Post = {
  _id: string
  slug?: string
  title?: string
  overview?: string
  publishedAt?: string
  publisher?: string
  externalUrl?: string
  coverImage?: string | null // now a string URL (or null)
}

export default function BlogCard({post}: {post: Post}) {
  const href = post.externalUrl ? post.externalUrl : `/blog/${post.slug}`
  const isExternal = Boolean(post.externalUrl)
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('fi-FI', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <article className="group relative h-64 sm:h-80 lg:h-96 rounded-[.5rem] overflow-hidden">
      {/* Image (or fallback) */}
      {post.coverImage ? (
        <a
          href={href}
          {...(isExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
          className="block w-full h-full"
          aria-label={post.title || 'Blog post'}
        >
          <Image
            src={post.coverImage}
            alt={post.title || 'Cover image'}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Text overlay */}
          <div className="absolute left-4 right-4 bottom-4 text-white">
            <h3 className="text-xl font-bold leading-tight">{post.title || 'Untitled'}</h3>

            {(dateLabel || post.publisher) && (
              <p className="mt-1 text-sm text-gray-200 opacity-90">
                {[dateLabel, post.publisher].filter(Boolean).join(' • ')}
              </p>
            )}

            {post.overview && (
              <p className="mt-2 text-sm text-gray-100/90 line-clamp-2">{post.overview}</p>
            )}
          </div>
        </a>
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
    </article>
  )
}
