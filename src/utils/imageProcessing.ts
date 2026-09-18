const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1920;
const FILE_SIZE_LIMIT = 15 * 1024 * 1024; // 15MB

export const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Please upload an image.'));
      return;
    }

    if (file.size > FILE_SIZE_LIMIT) {
      reject(new Error(`File is too large. Max size is ${FILE_SIZE_LIMIT / (1024 * 1024)}MB.`));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const widthRatio = MAX_WIDTH / width;
          const heightRatio = MAX_HEIGHT / height;
          const scale = Math.min(widthRatio, heightRatio);

          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 0.8 quality to save space
        // Note: JPEG does not support transparency. 
        // This is an explicit tradeoff to keep base64 strings smaller.
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};
