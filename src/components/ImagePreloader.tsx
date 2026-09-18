import React, { useEffect, useState } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onLoaded: () => void;
  children: React.ReactNode;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onLoaded, children }) => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const total = images.length;

    const promises = images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            setProgress(Math.round((loadedCount / total) * 100));
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            setProgress(Math.round((loadedCount / total) * 100));
            resolve();
          };
          img.src = src;
        })
    );

    Promise.all(promises).then(() => {
      setLoaded(true);
      onLoaded();
    });
  }, [images, onLoaded]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1f0a] z-50">
        <div className="relative mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="spinner">
            <circle cx="40" cy="40" r="35" stroke="#1a5c1a" strokeWidth="3" opacity="0.3" />
            <path
              d="M40 5 A35 35 0 0 1 75 40"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-jungle-400 font-body text-sm tracking-widest uppercase mb-4">
          Preparando experiencia
        </p>
        <div className="w-48 h-1 bg-jungle-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-jungle-600 to-jungle-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-jungle-600 font-body text-xs mt-2">{progress}%</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ImagePreloader;
