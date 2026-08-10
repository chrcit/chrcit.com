import type { ImgHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  generateSrcSet,
  urlFor,
} from '@/components/features/sanity/helpers/url-for';
import type { SanityImageSource } from '@sanity/image-url';
import type { ComplexImage as ComplexImageSchema } from '@gen/sanity';

type ComplexImageAsset = {
  crop?: unknown;
  hotspot?: unknown;
  asset?: { _ref: string } | null;
  lqip?: string | null;
} | null;

type ComplexImageQueryShape = {
  alt: string | null;
  caption: string | null;
  width: number | null;
  asset: ComplexImageAsset;
} | null;

export type ComplexImageValue =
  | ComplexImageSchema
  | ComplexImageQueryShape
  | null;

type Props = {
  value: ComplexImageValue;
  sizes?: string;
  widths?: number[];
  className?: string;
  imgClassName?: string;
  figureClassName?: string;
  priority?: boolean;
  showBlurPlaceholder?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'>;

export function ComplexImage({
  value,
  sizes = '100vw',
  widths = [320, 480, 640, 768, 1024, 1280, 1600, 1920],
  className,
  imgClassName,
  figureClassName,
  priority = false,
  showBlurPlaceholder = true,
  ...imgProps
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) setIsLoaded(true);
  }, []);

  const asset = value?.asset ?? null;
  if (!asset?.asset?._ref) return null;

  const source = asset as unknown as SanityImageSource;
  const srcSet = generateSrcSet(source, widths);
  const src = urlFor(source).width(1024).auto('format').url();
  const lqip =
    showBlurPlaceholder && 'lqip' in asset ? (asset.lqip ?? null) : null;

  const alt = value?.alt || '';

  const img = (
    <img
      {...imgProps}
      ref={imageRef}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={clsx(
        'relative h-full w-full',
        imgClassName ?? 'object-cover',
        lqip ? 'transition-opacity duration-300' : undefined,
        lqip ? (isLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-100'
      )}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      onLoad={() => setIsLoaded(true)}
    />
  );

  return (
    <figure className={figureClassName}>
      <div className={clsx('relative overflow-hidden', className)}>
        {lqip ? (
          <img
            src={lqip}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover blur-sm"
          />
        ) : null}
        {img}
      </div>
      {value?.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  );
}
