# Rainscope Filmworks Website

A modern, responsive website for Rainscope Filmworks - A Creative Production Company Shaped by the Pacific Northwest.

## Project Structure

```
rainscope-site/
├── index.html              # Main HTML file
├── _headers                # Cloudflare Pages headers configuration
├── _redirects              # Cloudflare Pages redirects configuration
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   ├── images/
│   │   ├── testimonials/   # Testimonial images
│   │   │   ├── testimonial-1.jpg
│   │   │   ├── testimonial-2.jpg
│   │   │   └── testimonial-3.jpg
│   │   └── hero-fallback.jpg  # Fallback image for video
│   └── videos/
│       └── hero-video.mp4  # Hero section video
└── main.py                 # Flask app (optional, not used for static site)
```

## Setup

1. Clone the repository
2. Add your media files:
   - Place hero video in `assets/videos/hero-video.mp4`
   - Place hero fallback image in `assets/images/hero-fallback.jpg`
   - Place testimonial images in `assets/images/testimonials/`:
     - `testimonial-1.jpg` (Noemi Lopez)
     - `testimonial-2.jpg` (Anton Hing)
     - `testimonial-3.jpg` (Danny Astefan)
   - Or update image paths in `index.html` to match your naming convention

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000`

## Deployment to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to Cloudflare Dashboard → Pages
3. Click "Create a project"
4. Connect your Git repository
5. Configure build settings:
   - **Framework preset**: None (or Static)
   - **Build command**: (leave empty for static site)
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (root)
6. Deploy!

The `_headers` and `_redirects` files will be automatically used by Cloudflare Pages for:
- Custom HTTP headers (security, caching)
- URL redirects and rewrites

### Option 2: Direct Upload

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Upload assets"
3. Upload all files (excluding `.gitignore` and `README.md` if desired)
4. Deploy!

## Media Files

### Required Media Files

1. **Hero Video**: `assets/videos/hero-video.mp4`
   - Recommended: MP4 format, H.264 codec
   - Recommended resolution: 1920x1080 or higher
   - Keep file size optimized for web

2. **Testimonial Images**: Place in `assets/images/testimonials/`
   - Update paths in `index.html` accordingly

### Optimizing Media

- **Videos**: Use tools like HandBrake or FFmpeg to compress
- **Images**: Optimize with tools like ImageOptim, TinyPNG, or Squoosh
- Consider using WebP format for images (with fallbacks)

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Hero section with video background
- ✅ Animated marquee text
- ✅ Auto-rotating testimonials carousel
- ✅ Expandable services accordion
- ✅ Interactive footer with map
- ✅ Social media links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The Google Maps embed requires an API key for production use (currently using a basic embed)
- Video autoplay may be restricted on some browsers (especially mobile)
- Consider adding a video fallback image for better loading experience

