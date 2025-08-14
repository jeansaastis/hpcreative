// sanity/schemas/objects/duration/index.ts
import {defineField} from 'sanity'

export default defineField({
  name: 'duration',
  title: 'Duration',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      title: 'Start',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
  ],
})
