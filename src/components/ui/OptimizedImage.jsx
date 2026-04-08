import { useState, useRef, useEffect } from 'react';

// Optimized image component with lazy loading, placeholder shimmer, and error fallback
export default function OptimizedImage({ src, alt, className = '', fallbackIcon = null, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  if (error || !src) {
    return (
      <div ref={imgRef} className={`flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-700 ${className}`} {...props}>
        {fallbackIcon || <span className="text-surface-600 text-2xl">📷</span>}
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 shimmer bg-surface-800" />
      )}
      {/* Actual image — only load when in viewport */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

// Compress image before upload (reduces to max 800px, 0.7 quality)
export function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressed = new File([blob], file.name, { type: 'image/webp', lastModified: Date.now() });
            // Only use compressed version if it's actually smaller
            resolve(compressed.size < file.size ? compressed : file);
          },
          'image/webp',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
