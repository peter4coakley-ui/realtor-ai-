// FIX: Removed self-import which caused a naming conflict.
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    // Use blob.type to ensure the correct MIME type is preserved
    return new File([blob], filename, { type: blob.type });
};

/**
 * Triggers a browser download for a given data URL.
 * @param dataUrl The base64 data URL of the file to download.
 * @param filename The desired name for the downloaded file.
 */
export const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};