import type {PortableTextBlock} from 'next-sanity'
import type {Image} from 'sanity'

export interface MilestoneItem {
  _key: string
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface Skill {
  title: string
}

export interface MediaItem {
  title?: string
  description?: string
  image?: Image
  url?: string
}

export interface HomePagePayload {
  title?: string
  overview?: PortableTextBlock[]
  hero?: {
    title?: string
    text?: PortableTextBlock[]
    image?: Image
  }
  skills?: {
    title?: string | null
  }[]
  showcaseProjects?: ShowcaseProject[]
}

export interface ShowcaseProject {
  _id: string
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}
