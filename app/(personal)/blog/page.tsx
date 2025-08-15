import BlogCard from '@/components/BlogCard'
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

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts?.map((post: any) => (
          <li key={post._id}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}
