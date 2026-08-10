# SanityImage Component

A responsive image component for Sanity images with automatic srcset generation, format optimization, and optional blur placeholder.

## Features

- **Automatic srcset generation**: Creates multiple image sizes for responsive loading
- **Format optimization**: Uses `auto=format` to serve WebP/AVIF when supported
- **Blur placeholder**: Optional LQIP (Low Quality Image Placeholder) for smooth loading
- **Performance optimized**: Lazy loading by default, eager loading for above-fold images
- **TypeScript**: Fully typed with Sanity's image types

## Usage

### Basic Usage

```tsx
import { SanityImage } from '~/components/sanity-image';

<SanityImage
  image={imageObject}
  alt="Description of image"
  width={800}
  sizes="(max-width: 768px) 100vw, 800px"
/>;
```

### With Blur Placeholder

```tsx
<SanityImage
  image={imageObject}
  alt="Hero image"
  width={1200}
  sizes="100vw"
  showBlurPlaceholder
  priority
/>
```

### Custom Widths

```tsx
<SanityImage
  image={imageObject}
  alt="Thumbnail"
  width={400}
  widths={[200, 400, 600, 800]}
  sizes="(max-width: 640px) 200px, 400px"
/>
```

### Logo/Icon (Small Fixed Size)

```tsx
<SanityImage
  image={logoImage}
  alt="Company logo"
  width={200}
  height={40}
  widths={[100, 200, 400]}
  sizes="200px"
  priority
  className="h-10 w-auto"
/>
```

## Props

| Prop                  | Type                | Default                        | Description                          |
| --------------------- | ------------------- | ------------------------------ | ------------------------------------ |
| `image`               | `SanityImageSource` | Required                       | Sanity image object                  |
| `alt`                 | `string`            | `''`                           | Alternative text for accessibility   |
| `width`               | `number`            | `800`                          | Target width for the main src        |
| `height`              | `number`            | -                              | Target height (optional)             |
| `sizes`               | `string`            | `'100vw'`                      | Responsive sizes attribute           |
| `className`           | `string`            | `''`                           | Additional CSS classes               |
| `priority`            | `boolean`           | `false`                        | Load eagerly (for above-fold images) |
| `widths`              | `number[]`          | `[400, 800, 1200, 1600, 2000]` | Array of widths for srcset           |
| `showBlurPlaceholder` | `boolean`           | `false`                        | Show LQIP blur placeholder           |

## Sizes Attribute Examples

The `sizes` attribute tells the browser what size the image will be displayed at:

```tsx
// Full width on mobile, 50% on tablet, fixed 800px on desktop
sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';

// Fixed size (like a logo)
sizes = '200px';

// Full width always
sizes = '100vw';

// Sidebar image
sizes = '(max-width: 1024px) 100vw, 300px';
```

## Best Practices

1. **Use `priority` for above-fold images**: Set `priority={true}` for hero images and other above-fold content
2. **Match `sizes` to your layout**: The `sizes` attribute should match your actual layout breakpoints
3. **Choose appropriate `widths`**: For small images (logos, avatars), use smaller widths like `[100, 200, 400]`
4. **Always provide `alt` text**: For accessibility and SEO
5. **Use blur placeholder sparingly**: Only for hero/featured images where it adds value

## How It Works

1. **Image URL Builder**: Uses `@sanity/image-url` to generate optimized URLs
2. **Auto Format**: Automatically serves WebP/AVIF when browser supports it
3. **Srcset Generation**: Creates multiple image variants at different widths
4. **Browser Selection**: Browser picks the optimal image based on device pixel ratio and viewport
5. **LQIP**: Optionally shows a blurred placeholder while the full image loads

## Performance

- Images are lazy-loaded by default
- Format is automatically optimized (WebP/AVIF)
- Multiple sizes prevent downloading unnecessarily large images
- Srcset allows browser to choose optimal size
