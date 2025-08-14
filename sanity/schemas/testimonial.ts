// schemaTypes/testimonial.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  type: 'document',
  title: 'HP:sta sanottua',
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      title: 'Quote',
    }),
    defineField({
      name: 'author',
      type: 'string',
      title: 'Name',
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Title or Role',
    }),
    defineField({
      name: 'portrait',
      type: 'image',
      title: 'Portrait Image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
