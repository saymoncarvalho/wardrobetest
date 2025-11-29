import React from 'react';
import { ImageAsset, SlotType } from '../types';

interface SlotProps {
  type: SlotType;
  image: ImageAsset | null;
  resultUrl?: string | null;
  onUpload?: (file: File) => void;
  isLoading?: boolean;
  label: string;
  className?: string;
}

export const Slot: React.FC<SlotProps> = ({ 
  type, 
  image, 
  resultUrl, 
  onUpload, 
  isLoading, 
  label,
  className 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  const handleShare = async () => {
    if (!resultUrl || !navigator.share) return;
    
    try {
      // Convert base64 result to a Blob/File for sharing
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const file = new File([blob], 'stylefusion-tryon.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'StyleFusion Look',
        text: 'Check out my new virtual try-on look!',
        files: [file],
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isResult = type === SlotType.RESULT;
  const displayImage = isResult ? resultUrl : image?.previewUrl;
  const canShare = isResult && !!navigator.share && !!resultUrl;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`
        relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-300
        ${displayImage ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}
      `}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-300 font-medium animate-pulse">Designing...</p>
          </div>
        )}

        {/* Content */}
        {displayImage ? (
          <div className="relative w-full h-full group">
             {/* Use img tag for displaying preview or result */}
            <img 
              src={displayImage} 
              alt={label} 
              className="w-full h-full object-cover"
            />
            
            {!isResult && !isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                  Change
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
            )}
            
            {isResult && (
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {canShare && (
                  <button 
                    onClick={handleShare}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors"
                    title="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </button>
                )}
                
                <a 
                  href={displayImage} 
                  download="stylefusion-tryon.png"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-colors"
                  title="Download Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full h-full flex items-center justify-center">
            {isResult ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </div>
                <p className="text-slate-500 text-sm">Result will appear here</p>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center group hover:bg-slate-700/30 transition-colors">
                <div className="w-16 h-16 bg-slate-700/50 group-hover:bg-slate-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
                <p className="text-slate-300 font-medium">Upload Image</p>
                <p className="text-slate-500 text-xs mt-2">JPG, PNG, WEBP</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};