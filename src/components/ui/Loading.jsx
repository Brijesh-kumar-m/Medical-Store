import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text }) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 size={sizes[size]} className="animate-spin text-brand-400" />
      {text && <p className="text-surface-400 text-sm">{text}</p>}
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
