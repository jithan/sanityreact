# Movie Pages Implementation Guide

This guide explains the Movie list and detail pages with Kaltura video integration.

## Setup

### 1. Update Your Sanity Schema

Add the comprehensive movie schema fields shown in `MOVIE_SETUP.md`. Key additions include:

- **slug**: For URL routing
- **poster**: Movie poster image
- **backdrop**: Hero background image
- **director**: Reference to person schema
- **cast**: Array of person references with character names
- **kalturaVideo**: For trailer videos (object with videoId, partnerId, title, caption, dimensions)
- **Additional metadata**: runtime, budget, box office, etc.

### 2. Components Created

#### MovieList.js
- Displays all movies in a responsive grid
- Shows movie poster, title, release year, rating, overview, director, and genres
- Fetches data from Sanity CMS with optimized queries
- Clicking a movie navigates to the detail page

#### MovieDetail.js
- Comprehensive movie detail page with hero section
- Shows backdrop image, poster, full metadata
- Director information with bio
- Cast grid with character names
- **Kaltura video player** for trailers
- Production details (budget, box office, companies, countries, languages)

### 3. Routing

Updated routes in App.js:
- `/movies` - Movie list page
- `/movies/:slug` - Movie detail page (supports both slug and ID)

### 4. Styling

Professional CSS included for:
- Responsive movie grid layout
- Hero section with backdrop overlay
- Cast member cards
- Movie metadata display
- Mobile-responsive design

## Features

✅ Movie list with poster grid layout
✅ Movie detail page with hero section
✅ Kaltura video trailer integration
✅ Director and cast information
✅ Movie metadata (runtime, budget, box office)
✅ Production details
✅ Responsive design
✅ Loading and error states
✅ Image optimization with lazy loading

## GROQ Queries

The components use GROQ to fetch data:

**MovieList Query:**
```groq
*[_type == "movie"] | order(releaseDate desc) {
  _id,
  title,
  slug,
  releaseDate,
  overview,
  poster,
  director -> { name, image },
  genres,
  rating
}
```

**MovieDetail Query:**
```groq
*[_type == "movie" && (slug.current == $slug || _id == $slug)][0] {
  _id,
  title,
  slug,
  releaseDate,
  overview,
  runtime,
  budget,
  boxOffice,
  poster,
  backdrop,
  director -> { name, image, bio },
  cast[] -> { name, image, character },
  genres,
  rating,
  kalturaVideoId,
  productionCompanies,
  countries,
  languages
}
```

## Required Schema Fields

### Movie Schema
- `title` (string, required)
- `slug` (slug, required)
- `releaseDate` (date, required)
- `overview` (blockContent)
- `runtime` (number)
- `budget` (number)
- `boxOffice` (number)
- `poster` (image, required)
- `backdrop` (image)
- `director` (reference to person)
- `cast` (array of person references)
- `genres` (array of strings, required)
- `rating` (number, 0-10)
- `kalturaVideo` (kalturaVideo object)
- `productionCompanies` (array of strings)
- `countries` (array of strings)
- `languages` (array of strings)

### Person Schema (for directors/cast)
- `name` (string, required)
- `image` (image)
- `bio` (text)
- `character` (string, for cast members)

## Kaltura Integration

To add movie trailers:

1. Create a `kalturaVideo` object in your movie's Kaltura Video field in Sanity Studio
2. Enter the Video ID (e.g., 1_abc123def)
3. Enter your Partner ID
4. Optionally add a custom title and caption
5. Set custom width/height if desired (leave blank for responsive)
6. The trailer will automatically appear in the movie detail page with your custom settings

## Customization

### Change Video Player Size
Update in `MovieDetail.js`:
```jsx
<KalturaVideoPlayer
  kalturaId={movie.kalturaVideo.videoId}
  partnerId={movie.kalturaVideo.partnerId}
  playerSize={{
    width: movie.kalturaVideo.width ? `${movie.kalturaVideo.width}px` : '100%',
    height: movie.kalturaVideo.height ? `${movie.kalturaVideo.height}px` : '600px'
  }}
/>
```

### Add More Cast Members
The cast grid automatically adapts to show all cast members. Each cast member should have:
- Reference to person document
- Character name (stored in person's `character` field)

### Customize Grid Layout
Modify grid columns in `MovieList.css`:
```css
.movies-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```

## Troubleshooting

**Movies not showing?**
- Check Sanity query results
- Verify movie documents are published
- Ensure slug field exists and matches route
- Check browser console for errors

**Images not loading?**
- Verify image assets exist in Sanity project
- Check image URLs are valid
- Ensure CDN is accessible

**Cast not displaying?**
- Ensure person documents exist and are referenced correctly
- Check that cast array contains valid references
- Verify person documents have required fields

**Video not playing?**
- Verify `kalturaVideoId` is correct
- Check Kaltura account permissions
- Ensure Partner ID is configured correctly
- Check browser console for player errors

## Performance Optimizations

- **Lazy loading**: Images load as they enter viewport
- **Optimized queries**: Only fetch required fields
- **Responsive images**: Different sizes for different screens
- **Efficient routing**: Slug-based URLs for SEO

## Next Steps

1. **Update Sanity schemas** - Add all fields from `MOVIE_SETUP.md`
2. **Create person documents** - For directors and cast members
3. **Add movie content** - Create movie documents with all metadata
4. **Configure Kaltura** - Add trailer videos if desired
5. **Test navigation** - Ensure all routes work correctly
6. **Customize styling** - Adjust colors, spacing, and layout as needed

See `MOVIE_SETUP.md` for complete schema definitions and `ARTICLE_SETUP.md` for reference on similar article implementation.