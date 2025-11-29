import React, { useCallback } from 'react';
import { UploadedImage } from '../types';

interface FileUploadProps {
  onImageSelected: (image: UploadedImage) => void;
  selectedImage: UploadedImage | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageSelected, selectedImage }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG or PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get raw base64
      const base64 = result.split(',')[1];
      
      onImageSelected({
        base64,
        mimeType: file.type,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  return (
    <div className="w-full">
      <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${selectedImage ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800'}`}>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {selectedImage ? (
             <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden shadow-2xl">
               <img 
                 src={selectedImage.previewUrl} 
                 alt="Preview" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                 <p className="text-white font-medium">Click to change</p>
               </div>
             </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-300 font-medium text-lg">Upload Your Starting Image</p>
              <p className="text-slate-500 text-sm mt-1">JPG or PNG supported</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;