import { DEFAULT_IMAGE } from '@/constants';

export const getBase64FromUrl = async (url: string): Promise<string> => {
  try {
    if (url.startsWith('data:image')) {
      return url; // L'URL est déjà une image en base64
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return DEFAULT_IMAGE;
  }
};
