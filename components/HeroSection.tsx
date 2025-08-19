'use client'

import Image from 'next/image'
import {CustomPortableText} from './CustomPortableText'
import MatterBackground from './MatterBackground'
import RevealCard from './RevealCard'

export default function HeroSection({data}: {data: any}) {
  if (!data) return null
  const {title, body, image} = data

  return (
    <section className="relative w-full z-10 pt-5 pb-12 md:pt-20 min-h-[100svh] md:-mt-20 px-5 md:px-10 bg-transparent">
      <MatterBackground />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Image */}
        {image?.asset?.url && (
          <div className="relative w-full aspect-[1/1] sm:aspect-[1/1] md:h-[640px]">
            <Image
              src={image.asset.url}
              alt={title || 'Hero image'}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, (min-width: 768px) 60vw, 100vw"
              className="object-cover rounded-t-[.5rem] md:rounded-[.5rem] z-0"
            />
            <div className="absolute inset-0 rounded-t-[.5rem] md:rounded-[.5rem] bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
          </div>
        )}

        {/* Card */}
        <div className="relative -mt-6 sm:-mt-6 md:mt-0 md:-ml-24 z-10">
          {title && body && (
            <RevealCard title={title}>
              <CustomPortableText id={null} type={null} path={[]} value={body} />
            </RevealCard>
          )}
        </div>
      </div>
    </section>
  )
}
