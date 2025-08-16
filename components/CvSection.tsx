// components/CvSection.tsx
'use client'

import Image from 'next/image'
import {CustomPortableText} from './CustomPortableText'

export default function CvSection({content, image}: {content: any[]; image?: {url: string}}) {
  return (
    <section className="w-full py-12 sm:px-6 bg-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
        {/* CV card (left on desktop) */}
        <div className="order-2 md:order-1 relative z-10 md:-mr-24">
          <div className="rounded-[.5rem] bg-white backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 md:p-10">
            {content && (
              <div className="prose prose-lg md:prose-xl prose-headings:font-bold prose-headings:mb-4 prose-p:mb-6 max-w-none">
                <CustomPortableText id={null} type={null} path={[]} value={content} />
              </div>
            )}
          </div>
        </div>

        {/* Image (right on desktop, hidden on mobile) */}
        {image?.url && (
          <div className="order-1 md:order-2 relative hidden md:block">
            <div className="relative h-[520px] rounded-[.5rem] overflow-hidden">
              <Image
                src={image.url}
                alt="CV Illustration"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              {/* gentle top-to-bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
