// Add these fields to your Sanity movie.ts/movie.js schema

import {defineField, defineType} from 'sanity'
import {MdMovie as icon} from 'react-icons/md'

export default defineType({
  name: 'movie',
  title: 'Movie',
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
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'blockContent',
      description: 'Movie synopsis or plot summary',
    }),
    defineField({
      name: 'runtime',
      title: 'Runtime (minutes)',
      type: 'number',
      description: 'Movie duration in minutes',
    }),
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'number',
      description: 'Production budget in USD',
    }),
    defineField({
      name: 'boxOffice',
      title: 'Box Office',
      type: 'number',
      description: 'Box office earnings in USD',
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backdrop',
      title: 'Backdrop Image',
      type: 'image',
      description: 'Wide backdrop image for hero section',
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'cast',
      title: 'Cast',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'person'}],
        options: {
          disableNew: true,
        }
      }],
      description: 'Main cast members',
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Movie rating out of 10',
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: 'kalturaVideo',
      title: 'Kaltura Video',
      type: 'kalturaVideo',
      description: 'Kaltura video object for trailer',
    }),
    defineField({
      name: 'productionCompanies',
      title: 'Production Companies',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      releaseDate: 'releaseDate',
      poster: 'poster',
      rating: 'rating',
    },
    prepare(selection) {
      const {releaseDate, rating} = selection
      const year = releaseDate ? new Date(releaseDate).getFullYear() : ''

      return {
        title: selection.title,
        subtitle: year ? `${year}${rating ? ` • ⭐ ${rating}/10` : ''}` : '',
        media: selection.poster,
      }
    },
  },
})

// Also ensure you have a 'person' schema for directors and cast:

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'character',
      title: 'Character (for cast)',
      type: 'string',
      description: 'Character name when used in cast reference',
    }),
  ],
})
