import { nanoid } from "nanoid";

// Fallback upload method that uses localStorage for demo purposes
// In a real app, you would use a different storage service
export async function fallbackUploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result as string;

        // Generate a unique ID for the image
        const imageId = nanoid();

        // Store in localStorage (only for demo purposes)
        // In a real app, you would use a different storage service
        localStorage.setItem(`fallback-image-${imageId}`, base64Data);

        // Return a fake URL that can be used to retrieve the image
        resolve(`/api/fallback-image/${imageId}`);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

// Function to retrieve a fallback image
export function getFallbackImage(id: string): string | null {
  return localStorage.getItem(`fallback-image-${id}`);
}
