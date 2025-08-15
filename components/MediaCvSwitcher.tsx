// components/MediaCvSwitcher.tsx
'use client'

import Image from 'next/image'
import {useState} from 'react'
import CvSection from './CvSection'

export default function MediaCvSwitcher({
  mediaGallery,
  cvSection,
}: {
  mediaGallery: any[]
  cvSection?: {content: any[]; image?: {asset: {url: string}}}
}) {
  const [activeTab, setActiveTab] = useState<'media' | 'cv'>('media')

  const isMedia = activeTab === 'media'

  return (
    <section className="w-full pt-5 sm:pt-20 px-6 bg-white">
      {/* Accessible, slider-style title control */}
      <div className="mb-6 flex justify-center">
        <div
          role="tablist"
          aria-label="Mediassa / CV"
          className="relative inline-grid grid-cols-2 rounded-[.5rem]"
        >
          {/* The sliding thumb (behind the labels) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 m-1 rounded-[.35rem] bg-blue transition-transform duration-700 ease-in-out will-change-transform"
            style={{transform: isMedia ? 'translateX(0%)' : 'translateX(100%)'}}
          />

          {/* Mediassa */}
          <button
            role="tab"
            aria-selected={isMedia}
            aria-controls="panel-media"
            id="tab-media"
            onClick={() => setActiveTab('media')}
            className={`font-display relative uppercase z-10 px-10 py-6 text-md font-semibold transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              isMedia ? 'text-white' : 'text-black'
            }`}
          >
            Mediassa
          </button>

          {/* CV */}
          <button
            role="tab"
            aria-selected={!isMedia}
            aria-controls="panel-cv"
            id="tab-cv"
            onClick={() => setActiveTab('cv')}
            className={`relative z-10 px-10 py-3 text-md font-semibold transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              !isMedia ? 'text-white' : 'text-black'
            }`}
          >
            CV
          </button>
        </div>
      </div>

      {/* Panels */}
      <div className="relative min-h-[300px]">
        {/* MediaGallery */}
        <div
          id="panel-media"
          role="tabpanel"
          aria-labelledby="tab-media"
          className={`py-10 transition-opacity duration-300 ${
            isMedia ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
        >
          {Array.isArray(mediaGallery) && mediaGallery.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mediaGallery.map((item, idx) => {
                const card = (
                  <>
                    {/* Image */}
                    {item.image?.asset?.url && (
                      <Image
                        src={item.image.asset.url}
                        alt={item.title || 'Media image'}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Text */}
                    <div className="absolute left-4 right-4 bottom-4 text-white">
                      <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                      {item.description && (
                        <p className="mt-0.5 text-sm text-gray-200 opacity-90">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </>
                )

                return (
                  <li
                    key={idx}
                    className="relative h-64 sm:h-80 lg:h-96 rounded-[.5rem] overflow-hidden group"
                  >
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* CV */}
        <div
          id="panel-cv"
          role="tabpanel"
          aria-labelledby="tab-cv"
          className={`transition-opacity duration-300 ${
            !isMedia ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
        >
          {cvSection && <CvSection content={cvSection.content} image={cvSection.image?.asset} />}
        </div>
      </div>
    </section>
  )
}
