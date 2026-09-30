import React, { useRef, useState } from 'react';
import { FileImage, FileText, Loader2, Upload } from 'lucide-react';

export interface ScannerFile {
  file: File;
  preview: Blob;
  isPdf: boolean;
}

interface FileUploaderProps {
  kind: 'image' | 'pdf';
  onSelected: (selected: ScannerFile) => void;
  onError: (message: string) => void;
}

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const FileUploader: React.FC<FileUploaderProps> = ({ kind, onSelected, onError }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const getPdfPreview = async (file: File): Promise<Blob> => {
    const pdfjs = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await document.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Unable to preview PDF')), 'image/png'));
  };

  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = imageTypes.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
    if ((kind === 'pdf' && !isPdf) || (kind === 'image' && !isImage)) {
      onError(kind === 'pdf' ? 'Please choose a PDF file.' : 'Unsupported image. Use JPG, JPEG, PNG, or WEBP.');
      return;
    }
    setProcessing(true);
    try {
      onSelected({ file, preview: isPdf ? await getPdfPreview(file) : file, isPdf });
    } catch (error) {
      onError(error instanceof Error ? `Could not open this PDF: ${error.message}` : 'Could not preview this file.');
    } finally { setProcessing(false); }
  };

  const isImage = kind === 'image';
  return <>
    <input ref={inputRef} type="file" accept={isImage ? '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp' : '.pdf,application/pdf'} onChange={selectFile} className="hidden" />
    <button type="button" onClick={() => inputRef.current?.click()} disabled={processing} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-sm font-semibold text-slate-700 transition-all disabled:opacity-60">
      {processing ? <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> : isImage ? <FileImage className="h-4 w-4 text-purple-600" /> : <FileText className="h-4 w-4 text-rose-600" />}
      <span>{processing ? 'Preparing preview…' : isImage ? 'Upload Image' : 'Upload PDF'}</span>
      {!processing && <Upload className="h-3.5 w-3.5 text-slate-400" />}
    </button>
  </>;
};
