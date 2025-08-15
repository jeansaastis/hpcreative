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

  if (!post?._id) {
    notFound()
  }

  const dateLabel = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('fi-FI', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="mx-auto max-w-3xl px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{post?.title || 'Untitled'}</h1>
        {(dateLabel || post?.publisher) && (
          <p className="mt-2 text-sm text-gray-500">
            {dateLabel}
            {dateLabel && post?.publisher && ' · '}
            {post?.publisher}
          </p>
        )}
        {post?.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((t: string, i: number) => (
              <span
                key={i}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </header>

      {post?.coverImage && (
        <div className="mb-8">
          <ImageBox
            image={post.coverImage}
            alt={post.title || 'Cover image'}
            classesWrapper="relative aspect-[16/9]"
          />
        </div>
      )}

      {post?.overview && <p className="mb-6 text-lg text-gray-700">{post.overview}</p>}

      {post?.body && (
        <div className="prose max-w-none">
          <CustomPortableText
            id={post._id}
            type={post._type}
            path={['body']}
            value={post.body as any}
          />
        </div>
      )}

      {post?.externalUrl && (
        <p className="mt-8">
          <Link
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Lue alkuperäinen artikkeli
          </Link>
        </p>
      )}
    </article>
  )
}
