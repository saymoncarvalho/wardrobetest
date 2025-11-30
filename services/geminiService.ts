import { GoogleGenAI } from "@google/genai";
import { ImageAsset } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a virtual try-on image combining a person and a clothing item.
 */
export const generateTryOn = async (
  personImage: ImageAsset,
  clothingImage: ImageAsset
): Promise<string> => {
  try {
    // Ensure we have base64 data
    const personBase64 = personImage.base64 || await fileToBase64(personImage.file);
    const clothingBase64 = clothingImage.base64 || await fileToBase64(clothingImage.file);

    const prompt = `
      You are an expert AI fashion stylist and image editor.
      
      Input 1: An image of a person.
      Input 2: An image of a clothing item.
      
      Task: Create a highly realistic image of the person from Input 1 wearing the clothing item from Input 2.
      
      Requirements:
      1. Preserve the person's identity, facial features, hair, pose, and body shape exactly as they appear in Input 1.
      2. Adapt the clothing item from Input 2 to fit naturally on the person's body in Input 1. Handle lighting, shadows, and fabric folds realistically.
      3. If the clothing is a top, replace the person's current top. If it's a dress, replace the outfit.
      4. The background should remain similar or be a neutral studio background if complex.
      5. Output ONLY the resulting image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: personImage.file.type,
              data: personBase64,
            },
          },
          {
            inlineData: {
              mimeType: clothingImage.file.type,
              data: clothingBase64,
            },
          },
        ],
      },
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      // Safely access content and parts to avoid TypeScript errors
      const content = candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate try-on image. Please try again.");
  }
};