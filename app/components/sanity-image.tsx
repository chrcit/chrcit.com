import type { SanityImageSource } from '@sanity/image-url';
import { urlFor, generateSrcSet } from '@/lib/sanity-image';
import { useEffect, useRef, useState } from 'react';

type SanityImageSourceWithLqip = SanityImageSource & {
  lqip?: string | null;
};

interface SanityImageProps {
  image: SanityImageSourceWithLqip;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  widths?: number[];
  showBlurPlaceholder?: boolean;
}

export function SanityImage({
  image,
  alt = '',
  width = 800,
  height,
  sizes = '100vw',
  className = '',
  priority = false,
  widths,
  showBlurPlaceholder = false,
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const srcSet = generateSrcSet(image, widths);
  const src = urlFor(image).width(width).auto('format').url();

  const lqip = showBlurPlaceholder ? (image.lqip ?? null) : null;

  useEffect(() => {
    if (imageRef.current?.complete) setIsLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {lqip && !isLoaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-sm"
        />
      )}
      <img
        ref={imageRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`${lqip ? 'relative' : ''} h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded || !lqip ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
