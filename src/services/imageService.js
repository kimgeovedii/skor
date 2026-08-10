import { removeBackground } from "@imgly/background-removal";
import { PHOTO_MAX_SIZE } from "@/constants";

/**
 * Resizes an image file to fit within maxSize while maintaining aspect ratio.
 * Returns a base64 data URL.
 */
export function resizeImage(file, maxSize = PHOTO_MAX_SIZE) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Blob to a resized base64 data URL (PNG).
 */
function blobToResizedDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height) {
          if (width > PHOTO_MAX_SIZE) {
            height = (height * PHOTO_MAX_SIZE) / width;
            width = PHOTO_MAX_SIZE;
          }
        } else {
          if (height > PHOTO_MAX_SIZE) {
            width = (width * PHOTO_MAX_SIZE) / height;
            height = PHOTO_MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png", 0.9));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * Removes background from an image file using @imgly/background-removal.
 * Falls back to simple resize if BG removal fails.
 */
export async function processBackgroundRemoval(file) {
  try {
    const blob = await removeBackground(file, {
      output: { format: "image/png" },
    });
    return blobToResizedDataUrl(blob);
  } catch (err) {
    console.error("BG removal failed, falling back to resize:", err);
    return resizeImage(file);
  }
}

/**
 * Processes a photo upload: attempts BG removal, falls back to resize.
 */
export async function processPhoto(file) {
  try {
    return await processBackgroundRemoval(file);
  } catch {
    return resizeImage(file);
  }
}
