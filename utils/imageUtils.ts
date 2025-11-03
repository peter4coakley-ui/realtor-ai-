/**
 * Applies a watermark to a given image data URL.
 * @param dataUrl The base64 data URL of the source image.
 * @returns A promise that resolves with the base64 data URL of the watermarked image.
 */
export const applyWatermark = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Set canvas size to image size
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // --- Watermark settings ---
      const watermarkText = "AI Enhanced";
      // Calculate font size relative to image width, with min/max caps
      const fontSize = Math.max(12, Math.min(canvas.width / 40, 48)); 
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      // Create a subtle gradient for the text
      const padding = fontSize * 0.75;
      const x = canvas.width - padding;
      const y = canvas.height - padding;
      
      const gradient = ctx.createLinearGradient(x - ctx.measureText(watermarkText).width, y - fontSize, x, y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      
      ctx.fillStyle = gradient;

      // Add a very subtle text shadow for legibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw the text
      ctx.fillText(watermarkText, x, y);

      // Resolve with the new data URL
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = dataUrl;
  });
};
