import React from 'react';
import { AlertCircle } from 'lucide-react';

export const StorageBlockedBanner: React.FC<{ isBlocked: boolean }> = ({ isBlocked }) => {
  if (!isBlocked) return null;

  return (
    <div className="p-3 rounded-xl bg-amber-950/40 border border-cine-amber/40 text-xs text-cine-amber-light flex items-center gap-2.5 mb-6" role="alert">
      <AlertCircle className="w-4 h-4 text-cine-amber shrink-0" />
      <span>
        <strong>Local Storage Inaccessible:</strong> Your browser has blocked local storage. CineFlow AI is running in resilient in-memory mode — creations are active for this session.
      </span>
    </div>
  );
};
