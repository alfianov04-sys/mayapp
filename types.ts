export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export type AspectRatio = '1:1' | '9:16' | '16:9';

export interface GenerationConfig {
  prompt: string;
  image: UploadedImage;
  aspectRatio: AspectRatio;
}

// Global declaration for the AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}