import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {sanityFetch} from '@/sanity/lib/live'
import {pagesBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

// 👇 Reserve slugs that have their own top-level routes
const RESERVED = new Set(['blog'])

type Params = {slug: string}

// (optional) if you’re using page-level metadata
export async function generateMetadata(
  {params}: {params: Params},
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  if (RESERVED.has(params.slug)) return {}
  // ...your existing metadata logic (if any)
  return {}
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'page'},
    stega: false,
    perspective: 'published',
  })

  // data looks like: [{ slug: 'about' }, { slug: 'blog' }, ...]
  return (data || [])
    .filter((d: any) => d?.slug && !RESERVED.has(d.slug))
    .map((d: any) => ({slug: d.slug}))
}

export default async function PageSlugRoute({params}: {params: Params}) {
  const {slug} = params

  if (RESERVED.has(slug)) {
    // Ensure /blog is never handled here
    notFound()
  }

  const {data} = await sanityFetch({
    query: pagesBySlugQuery,
    params: {slug},
  })

  if (!data?._id) {
    notFound()
  }

  const {title, overview, body} = data || {}

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-16 bg-white">
      {title && <Header id={data._id} type={data._type} path={[]} title={title} centered />}
      {overview && (
        <div className="mt-6 max-w-3xl text-gray-700 text-lg">
          <CustomPortableText
            id={data._id}
            type={data._type}
            path={['overview']}
            value={overview as unknown as PortableTextBlock[]}
          />
        </div>
      )}
      {body && (
        <div className="mt-8">
          <CustomPortableText
            id={data._id}
            type={data._type}
            path={['body']}
            paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
            value={body as unknown as PortableTextBlock[]}
          />
        </div>
      )}
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
