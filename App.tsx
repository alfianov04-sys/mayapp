import React, { useState, useEffect } from 'react';
import StepHeader from './components/StepHeader';
import FileUpload from './components/FileUpload';
import AspectRatioSelector from './components/AspectRatioSelector';
import { UploadedImage, AspectRatio } from './types';
import { generateVideo } from './services/veoService';

const App: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    }
  };

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assuming success as per instructions to avoid race conditions
        setApiKeyReady(true);
      } else {
        setError("AI Studio environment not detected.");
      }
    } catch (e) {
      console.error("Error selecting API key:", e);
      setError("Failed to select API Key. Please try again.");
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please describe the animation.");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setError(null);
    setLoadingStatus("Initializing...");

    try {
      const url = await generateVideo(image, prompt, aspectRatio, (status) => {
        setLoadingStatus(status);
      });
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      // If error is related to API key, reset state
      if (err.message && err.message.includes("API Key")) {
        setApiKeyReady(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!apiKeyReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6 font-display">
          Jayné’s Studio
        </h1>
        <p className="text-slate-400 max-w-md mb-8">
          To start creating amazing video animations with Veo, please select a paid Google Cloud Project API key.
        </p>
        <button
          onClick={handleSelectKey}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
        >
          Select API Key
        </button>
        <div className="mt-8 text-sm text-slate-500">
           <a 
             href="https://ai.google.dev/gemini-api/docs/billing" 
             target="_blank" 
             rel="noreferrer"
             className="underline hover:text-indigo-400"
           >
             Learn more about billing
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* App Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 font-display">
            Jayné’s Studio
          </h1>
          <div className="text-xs text-slate-500 font-mono border border-slate-700 rounded px-2 py-1">
            Veo-3 Powered
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-12">
        
        {/* Step 1: Upload */}
        <section>
          <StepHeader step={1} title="Upload Image" />
          <FileUpload onImageSelected={setImage} selectedImage={image} />
        </section>

        {/* Step 2: Describe */}
        <section>
          <StepHeader step={2} title="Describe Animation" />
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to animate the image. For example: 'make characters head explode and water rushes out,' or 'Slowly zoom in on the person's face and make them smile.'"
              className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-5 text-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              Be creative. Mention sounds or dialog if needed.
            </div>
          </div>
        </section>

        {/* Step 3: Aspect Ratio */}
        <section>
          <StepHeader step={3} title="Aspect Ratio" />
          <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} />
        </section>

        {/* Step 4: Generate Action */}
        <section className="pt-4">
           {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !image || !prompt}
            className={`
              w-full py-5 rounded-2xl text-xl font-bold tracking-wide shadow-xl transition-all transform
              ${isGenerating || !image || !prompt
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]'
              }
            `}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{loadingStatus}</span>
              </div>
            ) : (
              "Let’s Go!"
            )}
          </button>
        </section>

        {/* Output Area */}
        {videoUrl && (
          <section className="animate-fade-in-up">
            <div className="border-t border-slate-800 pt-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Animation</h2>
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
                <video 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full max-h-[70vh] object-contain mx-auto"
                  src={videoUrl}
                />
              </div>
              <div className="mt-6 flex justify-center">
                <a
                  href={videoUrl}
                  download="jaynes-studio-animation.mp4"
                  className="flex items-center space-x-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors border border-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download Video</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;