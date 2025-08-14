// /sanity/schemas/heroSection.ts
import {defineField, defineType} from 'sanity'

const heroSection = defineType({
  name: 'heroSection',
  title: 'Alkuesittely',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Text Body', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
  ],
})

export default heroSection
