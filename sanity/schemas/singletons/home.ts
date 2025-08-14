// sanity/schemas/singletons/home.ts
import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'Etusivu',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'overview',
      title: 'Description',
      description: 'Used for the site <meta> description tag.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Italic', value: 'em'},
              {title: 'Strong', value: 'strong'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'Url'}],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.max(155).required(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'reference',
      to: [{type: 'heroSection'}],
    }),

    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'skill'}],
    }),

    defineField({
      name: 'mediaGallery',
      title: 'Media Gallery',
      type: 'array',
      of: [{type: 'mediaItem'}],
    }),

    defineField({
      name: 'cvSection',
      title: 'CV Section',
      type: 'object',
      fields: [
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              styles: [],
              lists: [],
            }),
          ],
        }),
        defineField({
          name: 'image',
          title: 'Graphic',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),

    // testimonials as references
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'testimonial'}],
        },
      ],
    }),

    // blogPosts (plural) as references
    defineField({
      name: 'blogPosts',
      title: 'Blogi Posts',
      description: 'Which blog posts show up on your Blogi page',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'blogPost'}],
        },
      ],
    }),
  ],

  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title,
        subtitle: 'Home',
      }
    },
  },
})
