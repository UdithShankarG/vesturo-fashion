import { useState } from "react";
import {
  compressImage,
  validateImageFile,
  createImagePreview,
} from "../utils/imageCompression";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.url,
            publicId: response.publicId,
            width: response.width,
            height: response.height,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      // Get auth token
      const token = localStorage.getItem("token");
      xhr.open("POST", "/api/upload/image");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const uploadImages = async (files, options = {}) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        validateImageFile(file);

        // Compress image for faster upload
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1600,
          quality: 0.85,
          ...options,
        });

        console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        console.log(
          `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
        );

        // Upload to backend
        const uploadResult = await uploadToBackend(compressedFile);

        uploadedImages.push({
          url: uploadResult.url,
          alt: file.name.split(".")[0],
          width: uploadResult.width,
          height: uploadResult.height,
          publicId: uploadResult.publicId,
        });

        // Update progress for multiple files
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setUploading(false);
      setUploadProgress(100);

      return uploadedImages;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  const uploadSingleImage = async (file, options = {}) => {
    const results = await uploadImages([file], options);
    return results[0];
  };

  return {
    uploadImages,
    uploadSingleImage,
    uploading,
    uploadProgress,
  };
};
