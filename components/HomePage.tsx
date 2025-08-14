import BlogCard from '@/components/BlogCard'
import {Header} from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import MediaCvSwitcher from '@/components/MediaCvSwitcher'
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import SkillsGrid from '@/components/SkillsGrid.client'
import TestimonialsSection from '@/components/TestimonialsSection'
import type {HomePageQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
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

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
    <div className="space-y-20">
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
      {blogPosts.length > 0 && (
        <section className="w-full py-5 px-6 bg-white">
          <h2 className="font-display font-bold mb-6 text-5xl">Blogi</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post: any) => (
              <li key={post._id || post._key}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Testimonials */}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </div>
  )
}
