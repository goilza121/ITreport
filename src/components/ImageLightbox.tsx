import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageLightboxProps {
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  imageUrl,
  title,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div 
        className="w-full max-w-5xl flex items-center justify-between text-white pb-3 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <ZoomIn className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium truncate max-w-md">
            {title || 'รูปภาพประกอบ'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={imageUrl}
            download="it_work_photo.jpg"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">ดาวน์โหลด</span>
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div 
        className="relative max-w-5xl max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Enlarged photo'}
          className="max-w-full max-h-[82vh] object-contain rounded-lg select-none"
        />
      </div>
    </div>
  );
};
