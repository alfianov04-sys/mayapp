import { GoogleGenAI } from "@google/genai";
import { UploadedImage, AspectRatio } from "../types";

export const generateVideo = async (
  image: UploadedImage,
  prompt: string,
  aspectRatio: AspectRatio,
  onStatusUpdate: (status: string) => void
): Promise<string> => {
  // CRITICAL: Initialize a new instance right before the call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  onStatusUpdate("Initializing creative sequence...");

  try {
    // Start the generation operation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview', // High quality preview model
      prompt: prompt,
      image: {
        imageBytes: image.base64,
        mimeType: image.mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Standard for previews
        aspectRatio: aspectRatio,
      }
    });

    onStatusUpdate("Dreaming up the scene... (This may take a minute)");

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
      
      // Update status message periodically to keep user engaged
      const progressMessages = [
        "Rendering frames...",
        "Applying physics...",
        "Composing lighting...",
        "Polishing pixels...",
        "Almost there..."
      ];
      const randomMsg = progressMessages[Math.floor(Math.random() * progressMessages.length)];
      onStatusUpdate(randomMsg);

      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed.");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("No video URI returned from the model.");
    }

    onStatusUpdate("Downloading your masterpiece...");

    // Fetch the actual video content
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Veo generation error:", error);
    // Handle the specific "Requested entity was not found" error for API keys
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API Key Error: Please select your project again.");
    }
    throw error;
  }
};