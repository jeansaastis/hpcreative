// schemaTypes/settings.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logoLight',
      title: 'Logo (for light backgrounds)',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (for dark backgrounds)',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'home'}, {type: 'page'}]}],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Footer text (rich).',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
    }),
  ],
})
