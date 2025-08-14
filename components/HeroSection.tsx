'use client'

import Image from 'next/image'
import {CustomPortableText} from './CustomPortableText'

export default function HeroSection({data}: {data: any}) {
  if (!data) return null
  const {title, body, image} = data

  return (
    <section className="w-full py-5 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Image */}
        {image?.asset?.url && (
          <div className="relative w-full h-[420px] md:h-[680px]">
            <Image
              src={image.asset.url}
              alt={title || 'Hero image'}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, (min-width: 768px) 60vw, 100vw"
              className="object-cover rounded-[.5rem]"
            />
            <div className="absolute inset-0 rounded-[.5rem] bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
          </div>
        )}

        {/* Text (overlaps image a bit on desktop, sits below on mobile) */}
        <div className="relative z-10 h-50 p-6 bg-white/100 md:mt-0 md:-ml-24 rounded-[.5rem]">
          {title && <h1 className="font-display font-bold mb-4 text-4xl md:text-6xl">{title}</h1>}
          {body && <CustomPortableText id={null} type={null} path={[]} value={body} />}
        </div>
      </div>
    </section>
  )
}
