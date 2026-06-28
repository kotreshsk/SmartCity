import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadMedia = async (fileBlob, path, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!storage) {
      reject(new Error("Storage not initialized"));
      return;
    }

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, fileBlob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export const storageService = {
  uploadImage: uploadMedia,
  uploadVideo: uploadMedia,
  uploadMedia
};
