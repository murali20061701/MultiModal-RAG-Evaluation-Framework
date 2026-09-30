import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Loader2, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (image: Blob) => void;
  onClose: () => void;
  onError: (message: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [starting, setStarting] = useState(true);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((track) => track.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStarting(false);
      })
      .catch((error: DOMException) => {
        setStarting(false);
        onError(error.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can upload an image instead.'
          : 'Unable to open the camera. You can upload an image instead.');
      });
    return () => { active = false; stopStream(); };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) { onError('Could not capture the photo. Please try again.'); return; }
      stopStream();
      onCapture(blob);
    }, 'image/jpeg', 0.94);
  };

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-sm">
      <div className="relative aspect-[4/3] max-h-[55vh] flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {starting && <div className="absolute inset-0 flex items-center justify-center text-slate-200 text-sm gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Starting camera…</div>}
      </div>
      <div className="p-3 flex justify-between items-center">
        <span className="text-xs text-slate-300 flex items-center gap-1.5"><Camera className="h-4 w-4" /> Position the document inside the frame</span>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"><X className="h-4 w-4" /> Close</button>
          <button type="button" onClick={capture} disabled={starting} className="px-3 py-2 rounded-lg text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1.5"><CameraOff className="h-4 w-4" /> Take Photo</button>
        </div>
      </div>
    </div>
  );
};
