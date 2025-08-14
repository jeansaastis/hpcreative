// schemaTypes/settings.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Alternative text for accessibility',
        },
      ],
      description: 'Optional. Will appear in the center of the navigation bar.',
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
