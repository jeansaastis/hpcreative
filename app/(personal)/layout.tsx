import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {LinkedInIcon} from '@/components/icons/LinkedIn'
import {Navbar} from '@/components/Navbar'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, Viewport} from 'next'
import {toPlainText, VisualEditing, type PortableTextBlock} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'

export async function generateMetadata(): Promise<Metadata> {
  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}),
    sanityFetch({query: homePageQuery, stega: false}),
  ])

  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    settings?.ogImage,
  )
  return {
    title: homePage?.title
      ? {
          template: `%s | ${homePage.title}`,
          default: homePage.title || 'Personal website',
        }
      : undefined,
    description: homePage?.overview ? toPlainText(homePage.overview) : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function IndexRoute({children}: {children: React.ReactNode}) {
  const {data} = await sanityFetch({query: settingsQuery})
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <Navbar data={data} />
        <div className="mt-20 flex-grow">{children}</div>
        <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
          {data?.footer && (
            <CustomPortableText
              id={data._id}
              type={data._type}
              path={['footer']}
              paragraphClasses="text-md md:text-xl"
              value={data.footer as unknown as PortableTextBlock[]}
            />
          )}

          {data?.linkedinUrl && (
            <div className="mt-6 flex justify-center">
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex p-2 text-black hover:opacity-70"
              >
                {/* reuse the same icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="h-6 w-6">
                  <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.205 24 24 23.226 24 22.271V1.729C24 .774 23.205 0 22.225 0zM7.051 20.452H3.722V9h3.329v11.452zM5.386 7.433c-1.066 0-1.931-.866-1.931-1.933 0-1.066.865-1.932 1.931-1.932s1.932.866 1.932 1.932c0 1.067-.866 1.933-1.932 1.933zM20.451 20.452h-3.329v-5.59c0-1.334-.026-3.048-1.858-3.048-1.86 0-2.145 1.45-2.145 2.948v5.689H9.79V9h3.195v1.561h.045c.444-.84 1.528-1.727 3.147-1.727 3.364 0 3.974 2.217 3.974 5.1v6.518z" />
                </svg>
              </a>
            </div>
          )}
        </footer>
      </div>
      <Toaster />
      <SanityLive onError={handleError} />
      {(await draftMode()).isEnabled && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
    </>
  )
}
