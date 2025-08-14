import {HomePage} from '@/components/HomePage'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'

export default async function IndexRoute() {
  const {data} = await sanityFetch({query: homePageQuery})

  return (
    <main>
      <HomePage data={data} />
    </main>
  )
}
