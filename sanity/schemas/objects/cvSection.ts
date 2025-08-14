// sanity/schemas/objects/cvSection.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cvSection',
  title: 'CV Section',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      title: 'Side Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
