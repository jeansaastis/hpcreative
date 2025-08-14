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

  return (
    <section className="w-full py-5 px-6 bg-white">
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        <div className="flex justify-center gap-4">
          {['media', 'cv'].map((tab) => (
            <button
              key={tab}
              aria-pressed={activeTab === tab}
              onClick={() => setActiveTab(tab as 'media' | 'cv')}
              className={`px-6 py-4 text-lg font-semibold rounded-md border-2 border-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black ${
                activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {tab === 'media' ? 'Mediassa' : 'CV'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[300px]">
        {/* MediaGallery */}
        <div
          className={`transition-opacity duration-500 ${
            activeTab === 'media'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'
          }`}
        >
          {mediaGallery.length > 0 && (
            <div>
              <h2 className="font-display font-bold mb-6 text-5xl">Mediassa</h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mediaGallery.map((item, idx) => {
                  const cardContent = (
                    <>
                      {/* Background Image */}
                      {item.image?.asset?.url && (
                        <Image
                          src={item.image.asset.url}
                          alt={item.title || 'Media image'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Text overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
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
                    <li key={idx} className="relative rounded-md overflow-hidden group h-56 sm:h-64">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          {cardContent}
                        </a>
                      ) : (
                        cardContent
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* CV */}
        <div
          className={`transition-opacity duration-500 ${
            activeTab === 'cv'
              ? 'opacity-100 transition-opacity duration-500'
              : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full transition-opacity duration-500'
          }`}
        >
          {cvSection && (
            <>
              <h2 className="font-display font-bold mb-6 text-5xl">CV</h2>
              <CvSection content={cvSection.content} image={cvSection.image?.asset} />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
