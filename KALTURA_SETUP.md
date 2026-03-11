// Add this field to your Sanity article.ts/article.js schema

defineField({
  name: 'kalturaVideoId',
  title: 'Kaltura Video ID',
  type: 'string',
  description: 'Enter the Kaltura media entry ID (found in your Kaltura account)',
  validation: (rule) => rule.optional(),
})

// Full updated article schema example:

import {defineField, defineType} from 'sanity'
import {MdDescription as icon} from 'react-icons/md'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A short summary of the article',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'kalturaVideoId',
      title: 'Kaltura Video ID',
      type: 'string',
      description: 'Enter the Kaltura media entry ID',
      validation: (rule) => rule.optional(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      publishedAt: 'publishedAt',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author, publishedAt} = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''

      return {
        title: selection.title,
        subtitle: author ? `${author} • ${date}` : date,
        media: selection.media,
      }
    },
  },
})
