'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Product photography with a fallback. A missing or broken file must leave a
 * composed empty frame, not a torn image icon in the middle of the menu.
 */
export default function DishImage({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 48rem) 100vw, 20rem',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-surface"
        role="img"
        aria-label={`${alt} (photo unavailable)`}
      >
        <span className="label text-subtle">Mesa Nove</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
