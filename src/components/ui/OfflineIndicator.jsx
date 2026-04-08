import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg animate-slide-up">
      <WifiOff size={16} />
      <span>You are offline — Some features may not work</span>
    </div>
  );
}
