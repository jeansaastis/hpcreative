import {CustomPortableText} from '@/components/CustomPortableText'
import ImageBox from '@/components/ImageBox'
import {sanityFetch} from '@/sanity/lib/live'
import {allBlogPostsQuery, pagesBySlugQuery} from '@/sanity/lib/queries'
import Link from 'next/link'

export default async function BlogIndexPage() {
  const [{data: page}, {data: posts}] = await Promise.all([
    sanityFetch({query: pagesBySlugQuery, params: {slug: 'blog'}, stega: false}),
    sanityFetch({query: allBlogPostsQuery, stega: false}),
  ])

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 bg-white">
      {page?.title && (
        <h1 className="font-display font-bold mb-3 text-4xl md:text-6xl">{page.title}</h1>
      )}

      {page?.overview && (
        <div className="mb-10 text-gray-700">
          <CustomPortableText
            id={page._id}
            type={page._type}
            path={['overview']}
            value={page.overview as any}
          />
        </div>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post: any) => {
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
            <li key={post._id}>
              <Link
                href={href}
                {...(isExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                aria-label={post.title || 'Blog post'}
                className="group relative block h-64 rounded-[.5rem] overflow-hidden"
              >
                {/* Image background (or fallback) */}
                {post.coverImage ? (
                  <ImageBox
                    image={post.coverImage}
                    alt={post.title || 'Cover image'}
                    classesWrapper="absolute inset-0"
                    imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200" />
                )}

                {/* Readability gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Text overlay */}
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow">
                    {post.title || 'Untitled'}
                  </h3>

                  {(dateLabel || post.publisher) && (
                    <p className="mt-1 text-sm text-gray-200 opacity-90">
                      {[dateLabel, post.publisher].filter(Boolean).join(' • ')}
                    </p>
                  )}

                  {/* Optional ingress */}
                  {post.overview && (
                    <p className="mt-2 text-sm text-gray-100/90 line-clamp-2">{post.overview}</p>
                  )}

                  {/* Tags (pills) */}
                  {post.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((t: string) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded bg-white/15 backdrop-blur-sm"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
