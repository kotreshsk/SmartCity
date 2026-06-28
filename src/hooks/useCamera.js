import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCamera = useCallback(async () => {
    try {
      if (stream) return; // Already started
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false // Only video for now to simplify
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Return base64 for preview/AI, but we'll need Blob for upload and hash
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ blob, base64: reader.result });
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.85);
    });
  }, []);

  const startRecording = useCallback(() => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // Auto stop after configured max duration (e.g. 20s)
    const maxDuration = parseInt(import.meta.env.VITE_MAX_VIDEO_DURATION_SECONDS || '20') * 1000;
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        stopRecording();
      }
    }, maxDuration);
    
  }, [stream]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return {
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    startRecording,
    stopRecording,
    isRecording,
    error,
    isActive: !!stream
  };
};
