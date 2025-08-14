'use client'

/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/page.tsx` route
 */
import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import * as resolve from '@/sanity/plugins/resolve'
import {pageStructure, singletonPlugin} from '@/sanity/plugins/settings'
import blogPost from '@/sanity/schemas/documents/blogPost'
import page from '@/sanity/schemas/documents/page'
import heroSection from '@/sanity/schemas/heroSection'
import mediaItem from '@/sanity/schemas/mediaItem'
import cvSection from '@/sanity/schemas/objects/cvSection'
import duration from '@/sanity/schemas/objects/duration'
import milestone from '@/sanity/schemas/objects/milestone'
import skill from '@/sanity/schemas/objects/skill'
import timeline from '@/sanity/schemas/objects/timeline'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'
import testimonial from '@/sanity/schemas/testimonial'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

const title = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'HPCreative'

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || '',
  dataset: dataset || '',
  title: 'hpcreative – studio',
  schema: {
    types: [
      // Singletons
      home,
      settings,
      // Documents
      duration,
      page,
      blogPost,
      heroSection,
      testimonial,
      // Objects
      skill,
      mediaItem,
      cvSection,
      milestone,
      timeline,
    ],
  },

  plugins: [
    structureTool({
      structure: pageStructure([home, settings]),
    }),
    presentationTool({
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([home.name, settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
