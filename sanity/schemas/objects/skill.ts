import {defineField, defineType} from 'sanity'

const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})

export default skill
