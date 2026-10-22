import fs from 'fs';
import path from 'path';
import type { CSSProperties } from 'react';
import { imageSize } from 'image-size';
import ExportedImage from 'next-image-export-optimizer';

/*
 * Markdown images, and the raw HTML `<img>` tags in event bodies, rarely
 * declare dimensions. `ExportedImage` needs both — it uses them for the
 * placeholder's aspect ratio and to cap the srcset, while the CSS below
 * decides the rendered size. Files under `public/` are measured at build time;
 * remote images get an assumed landscape ratio, which is safe because the CSS
 * keeps `height: auto`.
 */
const FALLBACK_IMAGE_WIDTH = 1200;
const FALLBACK_IMAGE_HEIGHT = 800;
/** MDX pages put body copy in an `md` container at most. */
const BODY_IMAGE_SIZES = '(max-width: 900px) 100vw, 900px';

/** Parse an HTML dimension attribute, which arrives as a string. */
const toPixels = (value: unknown): number | undefined => {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/**
 * Intrinsic size of an image served from `public/`. Without it a small
 * picture would be stretched to the column: the srcset's `w` descriptors make
 * the browser size the image to `sizes`, not to its pixels.
 */
const localDimensions = (src: string): { width: number; height: number } | undefined => {
  if (!src.startsWith('/')) return undefined;
  try {
    const file = path.join(process.cwd(), 'public', decodeURI(src.split(/[?#]/)[0]));
    const { width, height } = imageSize(fs.readFileSync(file));
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
};

/** Optimized replacement for the `img` element in markdown and MDX content. */
export function MarkdownImage({
  src,
  alt,
  width,
  height,
  sizes = BODY_IMAGE_SIZES,
  style,
}: {
  src?: unknown;
  alt?: string;
  width?: unknown;
  height?: unknown;
  /** The rendered width when neither the markup nor the file gives one. */
  sizes?: string;
  /** Merged over the default sizing and spacing. */
  style?: CSSProperties;
}) {
  if (typeof src !== 'string' || src === '') return null;

  const intrinsic = localDimensions(src);
  // A declared width is what the image renders at; otherwise a local file
  // renders at its own width. `maxWidth` only ever shrinks either.
  const renderWidth = toPixels(width) ?? intrinsic?.width;
  const imageWidth = renderWidth ?? FALLBACK_IMAGE_WIDTH;
  const imageHeight =
    toPixels(height) ??
    (intrinsic
      ? Math.round((intrinsic.height * imageWidth) / intrinsic.width)
      : FALLBACK_IMAGE_HEIGHT);

  return (
    <ExportedImage
      src={src}
      alt={alt ?? ''}
      width={imageWidth}
      height={imageHeight}
      // Narrower than the column, the image's own width is the better hint.
      sizes={
        renderWidth && renderWidth < 900
          ? `(max-width: ${renderWidth}px) 100vw, ${renderWidth}px`
          : sizes
      }
      style={{
        maxWidth: '100%',
        width: renderWidth ? `${renderWidth}px` : undefined,
        height: 'auto',
        borderRadius: 12,
        margin: '1rem 0',
        ...style,
      }}
    />
  );
}
