// app/(personal)/blog/[slug]/page.tsx
import {CustomPortableText} from '@/components/CustomPortableText'
import ImageBox from '@/components/ImageBox'
import {sanityFetch} from '@/sanity/lib/live'
import {blogPostBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import {notFound} from 'next/navigation'

// Build static params WITHOUT draftMode()
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'blogPost'},
    stega: false,
    perspective: 'published',
  })
  return (data || []).map((d: any) => ({slug: d.slug}))
}

export default async function BlogPostPage({params}: {params: {slug: string}}) {
  const {data: post} = await sanityFetch({
    query: blogPostBySlugQuery,
    params,
  })

  if (!post?._id) notFound()

  const dateLabel = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('fi-FI', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="mx-auto max-w-4xl px-6 mb-12 py-5">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          aria-label="Takaisin blogiin"
        >
          <span aria-hidden>←</span>
          Takaisin blogiin
        </Link>
      </div>

      {/* Hero: title over image if present, otherwise centered title */}
      {post?.coverImage ? (
        <section className="relative mb-8">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 bg-gray-50">
            <ImageBox
              image={post.coverImage}
              alt={post.title || 'Cover image'}
              classesWrapper="relative aspect-[16/9]"
            />
          </div>

          {/* Overlay gradient + title/meta */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center p-6 sm:p-10">
              <div className="text-center">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow">
                  {post?.title || 'Untitled'}
                </h1>
                {(dateLabel || post?.publisher) && (
                  <p className="mt-3 text-sm text-white/80">
                    {dateLabel}
                    {dateLabel && post?.publisher && ' · '}
                    {post?.publisher}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <header className="mb-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black">
            {post?.title || 'Untitled'}
          </h1>
          {(dateLabel || post?.publisher) && (
            <p className="mt-3 text-sm text-gray-500">
              {dateLabel}
              {dateLabel && post?.publisher && ' · '}
              {post?.publisher}
            </p>
          )}
        </header>
      )}

      {/* Tags (shown below hero either way) */}
      {post?.tags?.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {post.tags.map((t: string, i: number) => (
            <span
              key={i}
              className="rounded-full border border-black/10 bg-black/[.03] px-3 py-1 text-xs font-medium text-gray-800"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Standfirst / overview */}
      {post?.overview && (
        <p className="mb-8 text-lg leading-relaxed text-gray-800">{post.overview}</p>
      )}

      {/* Body */}
      {post?.body && (
        <div
          className="
        prose prose-neutral max-w-none
        prose-headings:font-display prose-headings:text-black
        prose-p:text-gray-800 prose-a:text-black prose-a:underline hover:prose-a:opacity-80
        prose-strong:text-black prose-blockquote:border-l-black/20
        prose-img:rounded-xl prose-hr:my-10
      "
        >
          <CustomPortableText
            id={post._id}
            type={post._type}
            path={['body']}
            value={post.body as any}
          />
        </div>
      )}

      {/* External link */}
      {post?.externalUrl && (
        <p className="mt-10">
          <Link
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[.03] px-4 py-2 text-sm font-medium text-black hover:bg-black/5"
          >
            Lue alkuperäinen artikkeli
            <span aria-hidden>↗</span>
          </Link>
        </p>
      )}
    </article>
  )
}
