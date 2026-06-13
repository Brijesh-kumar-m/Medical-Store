import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text }) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 size={sizes[size]} className="animate-spin text-brand-400" />
      {text && <p className="text-surface-500 dark:text-surface-400 text-sm">{text}</p>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

// Skeleton loaders for premium shimmer effect
export function SkeletonCard({ count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface-200 dark:bg-surface-700/50 shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-3/4 shimmer" />
              <div className="h-3 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-1/2 shimmer" />
            </div>
            <div className="h-6 w-12 bg-surface-200 dark:bg-surface-700/50 rounded-lg shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProductGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-32 rounded-xl bg-surface-200 dark:bg-surface-700/50 mb-3 shimmer" />
          <div className="h-4 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-3/4 mb-2 shimmer" />
          <div className="h-5 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-1/3 mb-3 shimmer" />
          <div className="h-10 bg-surface-200 dark:bg-surface-700/50 rounded-2xl shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700/50 mb-3 shimmer" />
          <div className="h-3 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-2/3 mb-2 shimmer" />
          <div className="h-6 bg-surface-200 dark:bg-surface-700/50 rounded-lg w-1/3 shimmer" />
        </div>
      ))}
    </div>
  );
}
