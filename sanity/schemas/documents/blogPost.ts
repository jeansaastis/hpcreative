import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blogi',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime'}),
    // Use this as your "ingress" / summary
    defineField({name: 'overview', title: 'Ingress', type: 'text'}),

    // NEW
    defineField({name: 'publisher', title: 'Publisher', type: 'string'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', of: [{type: 'string'}]}),

    // NEW – for external articles/cards
    defineField({name: 'externalUrl', title: 'External URL', type: 'url'}),

    // NEW – choose how the card renders on the homepage
    defineField({
      name: 'cardVariant',
      title: 'Card Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Standard (image + meta + ingress)', value: 'standard'},
          {title: 'Image link (overlay title)', value: 'imageLink'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),

    // Full post body (optional if you only link out)
    defineField({name: 'body', title: 'Body', type: 'array', of: [{type: 'block'}]}),
  ],
})
