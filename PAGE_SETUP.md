# Page Management System

This guide explains how to create and manage pages with automatic header menu integration.

## Setup

### 1. Page Schema

Your page schema includes the following fields:

```javascript
import {defineField, defineType} from 'sanity'
import {MdWeb as icon} from 'react-icons/md'

export default defineType({
  name: 'page',
  title: 'Page',
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
      name: 'showInHeaderMenu',
      title: 'Show in Header Menu',
      type: 'boolean',
      description: 'Enable this to display this page in the header navigation menu',
      initialValue: false,
    }),
    defineField({
      name: 'menuTitle',
      title: 'Menu Title',
      type: 'string',
      description: 'Custom title to display in the menu (defaults to page title)',
      hidden: ({ parent }) => !parent?.showInHeaderMenu,
    }),
    defineField({
      name: 'menuOrder',
      title: 'Menu Order',
      type: 'number',
      description: 'Order in the header menu (lower numbers appear first)',
      hidden: ({ parent }) => !parent?.showInHeaderMenu,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'blockContent', // Changed from pageBuilder to blockContent
      description: 'Build your page content using rich text',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      description: 'description',
      showInHeaderMenu: 'showInHeaderMenu',
      menuTitle: 'menuTitle',
    },
    prepare(selection) {
      const { title, slug, description, showInHeaderMenu, menuTitle } = selection
      const displayTitle = showInHeaderMenu ? `${title} 📍` : title
      const subtitle = showInHeaderMenu
        ? `/${slug?.current || ''} • Menu: ${menuTitle || title}`
        : `/${slug?.current || ''}`

      return {
        title: displayTitle,
        subtitle: subtitle,
        description: description,
        media: icon,
      }
    },
  },
})
```

## Features

### Dynamic Header Menu

✅ **Automatic Menu Generation** - Pages with `showInHeaderMenu: true` appear in header navigation
✅ **Custom Menu Titles** - Use `menuTitle` for different display text than page title
✅ **Menu Ordering** - Control order with `menuOrder` field (lower numbers first)
✅ **Real-time Updates** - Menu updates automatically when pages are published/unpublished

### Page Content

✅ **Rich Text Support** - Use `blockContent` type for rich content
✅ **SEO Optimization** - Meta title, description, and Open Graph images
✅ **Responsive Design** - Mobile-friendly page layouts
✅ **Media Support** - Images, links, and formatted content

## How to Use

### 1. Create a Page

1. Go to Sanity Studio
2. Create a new "Page" document
3. Fill in the title and slug
4. Add your page content using the page builder

### 2. Add to Header Menu

1. Check "Show in Header Menu"
2. (Optional) Set a custom "Menu Title"
3. (Optional) Set "Menu Order" (0 = first, higher numbers = later)
4. Publish the page

### 3. Menu Behavior

- Pages appear in the header menu automatically
- Menu items are sorted by `menuOrder` (ascending)
- If no `menuOrder` is set, pages sort alphabetically by title
- Menu title defaults to page title if `menuTitle` is empty

## Components Created

### PageDetail.js
- Displays full page content with rich text rendering
- Supports images, links, and formatted text
- SEO meta tag management
- Responsive design

### Dynamic Navigation
- Fetches menu items on app load
- Updates automatically when pages change
- Supports custom menu titles and ordering

## GROQ Queries

### Menu Items Query
```groq
*[_type == "page" && showInHeaderMenu == true] | order(menuOrder asc, title asc) {
  _id,
  title,
  slug,
  menuTitle
}
```

### Page Detail Query
```groq
*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  content,
  seo {
    metaTitle,
    metaDescription,
    ogImage {
      asset -> {
        url
      }
    }
  }
}
```

## Routing

- **Page URLs**: `/pages/{slug}`
- **Homepage**: root path (`/`) loads page with slug `home` automatically
- **Dynamic Routes**: Automatically generated for all published pages
- **SEO Friendly**: Clean URLs based on page slugs

## Customization

### Change Menu Styling
Update `.nav-menu` styles in `App.css`:

```css
.nav-menu {
  display: flex;
  gap: 30px;
  /* Add your custom styles */
}
```

### Add Page Templates
Extend the page schema with template fields:

```javascript
defineField({
  name: 'template',
  title: 'Page Template',
  type: 'string',
  options: {
    list: [
      { title: 'Default', value: 'default' },
      { title: 'Landing Page', value: 'landing' },
      { title: 'Contact', value: 'contact' },
    ]
  }
})
```

### Custom Page Components
Create different layouts based on page content:

```javascript
// In PageDetail.js
if (page.template === 'landing') {
  return <LandingPageLayout page={page} />
}
```

## Troubleshooting

**Menu not updating?**
- Ensure page is published
- Check `showInHeaderMenu` is set to `true`
- Refresh the app (menu loads on app start)

**Page not found?**
- Verify slug is correct
- Check page is published
- Ensure no duplicate slugs

**SEO not working?**
- Check `seo` object is properly filled
- Verify meta tags are updating in browser dev tools

**Content not displaying?**
- Ensure `content` field uses correct block types
- Check PortableText components are properly configured

## Next Steps

1. **Create blockContent schema** - Ensure blockContent type is properly configured
2. **Add more content types** - Extend with custom blocks if needed
3. **Use homepage slug** - Create a page document with slug `home` and add your hero, features, splitImage, textSection objects inside its content to render on `/`.
4. **Implement breadcrumbs** - Add navigation breadcrumbs
5. **Add page analytics** - Track page views and engagement
6. **Create page archives** - List all pages with filtering

The dynamic menu system will automatically include any page with `showInHeaderMenu: true`, making it easy to manage your site's navigation structure!