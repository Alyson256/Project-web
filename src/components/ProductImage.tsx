import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function ProductImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = ''
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(Boolean(imgRef.current?.complete && imgRef.current.naturalWidth > 0));
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={`Sem foto ainda · ${alt}`}
        className={`bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center p-3 text-center select-none w-full h-full min-h-[100px] ${containerClassName}`}
      >
        <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-700/60 flex items-center justify-center text-stone-500 dark:text-stone-400 mb-1.5 shrink-0">
          <Camera className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="text-[16px] font-bold text-stone-600 dark:text-stone-300 leading-tight">
          Sem foto ainda
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setHasError(true);
        setIsLoaded(true);
      }}
      className={`${className} ${!isLoaded ? 'bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none' : ''}`}
      loading="lazy"
    />
  );
}
