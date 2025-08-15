// components/Navbar.tsx
import {LinkedInIcon} from '@/components/icons/LinkedIn'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

interface NavbarProps {
  data: SettingsQueryResult
}

export function Navbar({data}: NavbarProps) {
  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  // Split items into left / right for layout
  const half = Math.ceil((data.menuItems?.length || 0) / 2)
  const leftItems = data.menuItems?.slice(0, half) || []
  const rightItems = data.menuItems?.slice(half) || []

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between backdrop-blur px-4 py-4 md:px-16 md:py-5 lg:px-32"
      data-sanity={dataAttribute?.('menuItems')}
    >
      {/* Left menu */}
      <nav className="flex items-center gap-x-5">
        {leftItems.map((menuItem) => {
          const href = menuItem._type === 'home' ? '/' : resolveHref(menuItem._type, menuItem.slug)
          if (!href) return null
          return (
            <Link
              key={menuItem._key}
              href={href}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.(['menuItems', {_key: menuItem._key}])}
            >
              {stegaClean(menuItem.title)}
            </Link>
          )
        })}
      </nav>

      {/* Center logo */}
      {data?.logo?.asset?.url && (
        <Link href="/" className="flex-shrink-0">
          <Image
            src={data.logo.asset.url}
            alt={data.logo.alt || 'Site logo'}
            width={80}
            height={80}
            className="h-12 w-auto object-contain"
          />
        </Link>
      )}

      {/* Right menu + socials */}
      <nav className="flex items-center gap-x-5">
        {rightItems.map((menuItem) => {
          const href = menuItem._type === 'home' ? '/' : resolveHref(menuItem._type, menuItem.slug)
          if (!href) return null
          return (
            <Link
              key={menuItem._key}
              href={href}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.(['menuItems', {_key: menuItem._key}])}
            >
              {stegaClean(menuItem.title)}
            </Link>
          )
        })}

        {data?.linkedinUrl && (
          <Link
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex p-1 text-black hover:opacity-70"
          >
            <LinkedInIcon className="h-5 w-5" />
          </Link>
        )}
      </nav>
    </header>
  )
}
