import AlternatePanel from '@/components/AlternatePanel'
import BlogCard from '@/components/BlogCard'
import ContactMe from '@/components/ContactMe'
import {Header} from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import MediaCvSwitcher from '@/components/MediaCvSwitcher'
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import SkillsGrid from '@/components/SkillsGrid'
import TestimonialsSection from '@/components/TestimonialsSection'
import type {HomePageQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

export async function HomePage({data}: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const overview = data?.overview ?? []
  const blogPosts = (data as any)?.blogPosts ?? []
  const title = data?.title ?? ''
  const hero = data?.hero ?? null
  const skills = data?.skills ?? []
  const safeSkills: {title: string}[] = Array.isArray(skills)
    ? skills.map((s: any) => ({title: s?.title ?? ''}))
    : []
  const mediaGallery = data?.mediaGallery ?? []
  const cvSection = data?.cvSection
  const testimonials = data?.testimonials ?? []
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})
  const linkedinUrl = settings?.linkedinUrl || undefined

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
    <div className="space-y-5">
      {/* Header */}
      {title && <></>}
      {/* Hero */}
      {hero && <HeroSection data={hero} />}
      {/* Skills */}
      {safeSkills.length > 0 && <SkillsGrid skills={safeSkills} />}

      {/* Media / CV Switcher */}
      {(Array.isArray(mediaGallery) && mediaGallery.length > 0) || cvSection ? (
        <MediaCvSwitcher mediaGallery={mediaGallery} cvSection={cvSection} />
      ) : null}

      {/* Blog */}
      <section className="w-full pt-5 sm:pt-20 px-3 md:px-10 bg-white">
        <div className="w-full">
          {Array.isArray(blogPosts) && blogPosts.length > 0 && (
            <h2 id="blogi-heading" className="text-blue hp-h2 hp-h2--light hp-h2--left p-5">
              Blogi — uusimmat
            </h2>
          )}

          {Array.isArray(blogPosts) && blogPosts.length > 0 ? (
            // With posts
            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pl-0 ml-0 list-none">
                  {blogPosts.slice(0, 2).map((post: any, i: number) => (
                    <li key={post._id || post._key}>
                      <BlogCard post={post} priority={i === 0} />
                    </li>
                  ))}
                </ul>
              </div>
              <div id="contact" className="lg:col-span-5 lg:border-black/10 lg:pl-12">
                <ContactMe />
              </div>
            </div>
          ) : (
            // No posts → Orbs + Contact
            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7 p-6">
                <AlternatePanel
                  heading="Tähän nostan tulevaisuudessa kiinnostavia ilmiöitä."
                  sub="Sillä välin ota yhteyttä — vastaan mielelläni kysymyksiin."
                  linkedinUrl={linkedinUrl}
                />
              </div>
              <div id="contact" className="lg:col-span-5 lg:border-black/10 lg:pl-12">
                <ContactMe />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </div>
  )
}
