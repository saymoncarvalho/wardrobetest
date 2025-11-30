import React, { useState } from 'react';
import { Slot } from './components/Slot';
import { ImageAsset, SlotType, GenerationState } from './types';
import { generateTryOn } from './services/geminiService';
import { downloadSourceCode } from './utils/zipService';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageAsset | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageAsset | null>(null);
  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultUrl: null,
  });
  const [isZipping, setIsZipping] = useState(false);

  const handleUpload = (file: File, type: SlotType) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const asset: ImageAsset = {
        file,
        previewUrl: e.target?.result as string,
        // Base64 logic handled inside service if needed, or here
      };
      
      if (type === SlotType.PERSON) {
        setPersonImage(asset);
      } else if (type === SlotType.CLOTHING) {
        setClothingImage(asset);
      }
      
      // Reset result if inputs change
      if (genState.resultUrl) {
         setGenState(prev => ({ ...prev, resultUrl: null }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) return;

    setGenState({ isLoading: true, error: null, resultUrl: null });

    try {
      const resultBase64 = await generateTryOn(personImage, clothingImage);
      setGenState({
        isLoading: false,
        error: null,
        resultUrl: resultBase64,
      });
    } catch (error: any) {
      setGenState({
        isLoading: false,
        error: error.message || "Something went wrong",
        resultUrl: null,
      });
    }
  };

  const handleDownloadSource = async () => {
    setIsZipping(true);
    await downloadSourceCode();
    setIsZipping(false);
  };

  const canGenerate = personImage !== null && clothingImage !== null && !genState.isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              StyleFusion
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-700 rounded-full px-3 py-1">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Visualize your style <span className="text-indigo-400">instantly</span>.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload a photo of yourself and a clothing item. Our AI will seamlessly merge them to show you how it fits.
          </p>
        </div>

        {/* The Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-8 items-center">
          
          {/* Slot 1: Person */}
          <div className="md:col-span-3">
             <Slot 
               type={SlotType.PERSON} 
               label="1. Your Photo" 
               image={personImage}
               onUpload={(f) => handleUpload(f, SlotType.PERSON)}
             />
          </div>

          {/* Plus Sign */}
          <div className="md:col-span-1 flex justify-center py-4 md:py-0">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </div>

          {/* Slot 2: Clothing */}
          <div className="md:col-span-3">
             <Slot 
               type={SlotType.CLOTHING} 
               label="2. The Clothes" 
               image={clothingImage}
               onUpload={(f) => handleUpload(f, SlotType.CLOTHING)}
             />
          </div>

          {/* Arrow / Equals Sign */}
          <div className="md:col-span-1 flex justify-center py-4 md:py-0">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${genState.isLoading ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                {genState.isLoading ? (
                   <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                )}
             </div>
          </div>

          {/* Slot 3: Result */}
          <div className="md:col-span-3">
             <Slot 
               type={SlotType.RESULT} 
               label="3. New Look" 
               image={null}
               resultUrl={genState.resultUrl}
               isLoading={genState.isLoading}
               className={genState.resultUrl ? "animate-in fade-in zoom-in duration-500" : ""}
             />
          </div>

        </div>

        {/* Error Message */}
        {genState.error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center max-w-lg mx-auto">
            <p className="font-semibold">Generation Failed</p>
            <p className="text-sm opacity-80">{genState.error}</p>
          </div>
        )}

      </main>

      {/* Footer / Downloads */}
      <footer className="py-8 border-t border-slate-800/50 mt-12 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} StyleFusion. AI-Generated Virtual Try-On.
          </p>
          <button 
            onClick={handleDownloadSource}
            disabled={isZipping}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 rounded-full px-4 py-2 bg-slate-800/50"
          >
            {isZipping ? (
              <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            )}
            {isZipping ? 'Packing files...' : 'Download Source Code'}
          </button>
        </div>
      </footer>

      {/* Sticky Bottom Action */}
      <div className="sticky bottom-8 z-40 px-6 flex justify-center pointer-events-none">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`
            pointer-events-auto
            relative group px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300
            ${canGenerate 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 hover:shadow-indigo-500/25' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
          `}
        >
          {genState.isLoading ? (
            <span className="flex items-center gap-2">
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
              Try it On
            </span>
          )}
          
          {/* Button Glow Effect */}
          {canGenerate && (
            <div className="absolute inset-0 rounded-full bg-indigo-400 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          )}
        </button>
      </div>
      
    </div>
  );
};

export default App;