# Article Pages Implementation Guide

This guide explains the Article list and detail pages with Kaltura video integration.

## Setup

### 1. Update Your Sanity Schema

Add the `kalturaVideo` field to your article schema in Sanity Studio. Here's the updated schema:

```javascript
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
      name: 'kalturaVideo',
      title: 'Kaltura Video',
      type: 'kalturaVideo', // Reference to your kalturaVideo object type
      description: 'Optional video to embed in the article',
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
```

### 1.5 Create the kalturaVideo Object Type

Make sure you have the `kalturaVideo` object type defined (as you provided):

```javascript
import {defineField, defineType} from 'sanity'
import {MdVideocam as icon} from 'react-icons/md'

export default defineType({
  name: 'kalturaVideo',
  title: 'Kaltura Video',
  type: 'object',
  icon,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'The Kaltura video entry ID (e.g., 1_abc123def)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'partnerId',
      title: 'Partner ID',
      type: 'string',
      description: 'Your Kaltura partner ID',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
      description: 'Optional title to display above the video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      description: 'Optional caption to display below the video',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number',
      description: 'Video width in pixels (optional, defaults to responsive)',
      validation: (rule) => rule.min(200).max(1920),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
      description: 'Video height in pixels (optional, defaults to responsive)',
      validation: (rule) => rule.min(150).max(1080),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      videoId: 'videoId',
      partnerId: 'partnerId',
    },
    prepare(selection) {
      const {title, videoId, partnerId} = selection
      return {
        title: title || `Kaltura Video: ${videoId}`,
        subtitle: `Partner: ${partnerId}`,
        media: icon,
      }
    },
  },
})
```

### 2. Components Created

#### KalturaVideoPlayer.js
- Embeds Kaltura videos using the Kaltura JavaScript library
- Props:
  - `kalturaId`: The Kaltura media entry ID (required)
  - `partnerId`: Your Kaltura partner ID (required)
  - `playerSize`: Custom player dimensions (default: 100% width, 400px height)

**Usage Example:**
```jsx
<KalturaVideoPlayer 
  kalturaId="video123"
  partnerId="your-partner-id"
  playerSize={{ width: '100%', height: '500px' }}
/>
```

#### ArticleList.js
- Displays all published articles in a responsive grid
- Shows article preview with image, title, excerpt, author, and date
- Fetches data from Sanity CMS
- Clicking an article navigates to the detail page

#### ArticleDetail.js
- Displays full article with rich text content
- Shows author information and publication date
- Embeds Kaltura video if `kalturaVideo` object is provided
- Displays custom video title and caption
- Supports custom video dimensions
- Displays tags
- Includes back navigation to article list

### 3. Routing

The app now uses React Router with these routes:
- `/` - Redirects to articles list
- `/articles` - Article list page
- `/articles/:slug` - Article detail page

### 4. Styling

Professional CSS included for:
- Responsive grid layout
- Card hover effects
- Article detail page formatting
- Mobile-responsive design

## Features

✅ Article list with grid layout
✅ Article detail page with rich text
✅ Kaltura video player integration with custom titles and captions
✅ Custom video dimensions support
✅ Dynamic partner ID configuration
✅ Author information display
✅ Publication date
✅ Tags display
✅ Responsive design
✅ Loading and error states
✅ Image optimization with lazy loading

## Kaltura Configuration

To use Kaltura videos:

1. Create a `kalturaVideo` object in your article's Kaltura Video field in Sanity Studio
2. Enter the Video ID (e.g., 1_abc123def)
3. Enter your Partner ID
4. Optionally add a custom title and caption
5. Set custom width/height if desired (leave blank for responsive)

The video will automatically appear in the article detail page with your custom settings.

## GROQ Queries

The components use GROQ to fetch data:

**ArticleList Query:**
```groq
*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  author -> { name, image }
}
```

**ArticleDetail Query:**
```groq
*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  publishedAt,
  mainImage,
  author -> { name, image, bio },
  tags,
  kalturaVideo // Now fetches the full kalturaVideo object
}
```

## Customization

### Change Partner ID
Update in `src/components/KalturaVideoPlayer.js`:
```javascript
const KalturaVideoPlayer = ({ 
  kalturaId, 
  partnerId = 'YOUR_PARTNER_ID', // Change this
  playerSize = { width: '100%', height: '400px' } 
})
```

### Customize Player Size
Pass custom dimensions when using the component:
```jsx
<KalturaVideoPlayer 
  kalturaId={article.kalturaVideo.videoId}
  partnerId={article.kalturaVideo.partnerId}
  playerSize={{ width: '100%', height: '600px' }}
/>
```

### Add More Fields
To add fields to articles, update:
1. Sanity schema
2. GROQ queries in components
3. Component JSX to display the new fields

## Troubleshooting

**Video not showing?**
- Verify the `kalturaVideo.videoId` and `kalturaVideo.partnerId` are correct
- Check your Kaltura account is active
- Ensure kalturaVideo object is properly filled in Sanity Studio
- Check browser console for errors

**Images not loading?**
- Ensure image assets exist in Sanity project
- Check image URLs are valid
- Verify CDN is accessible

**Articles not displaying?**
- Check Sanity query results
- Verify article documents are published
- Check slug field value matches route
- Check browser console for errors
