import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';
import { client } from '@/lib/sanity';

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function generateSrcSet(
  source: SanityImageSource,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string {
  return widths
    .map(
      (width) => `${urlFor(source).width(width).auto('format').url()} ${width}w`
    )
    .join(', ');
}
