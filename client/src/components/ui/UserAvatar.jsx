import { useState } from 'react';

const sizes = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-20 h-20 text-2xl',
};

export default function UserAvatar({ src, name, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const initial = name?.[0]?.toUpperCase() || '?';
  const sizeClass = sizes[size] ?? sizes.md;

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        onError={() => setImgError(true)}
        className={`rounded-full object-cover flex-shrink-0 ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClass} ${className}`}>
      {initial}
    </div>
  );
}
