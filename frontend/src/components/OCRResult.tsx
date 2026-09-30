import React from 'react';
import { CheckCircle2, Clipboard, Download, Eraser, Loader2 } from 'lucide-react';

interface OCRResultProps {
  text: string;
  onChange: (text: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onAddToRag: () => void;
  isIngesting: boolean;
}

export const OCRResult: React.FC<OCRResultProps> = ({ text, onChange, onCopy, onDownload, onClear, onAddToRag, isIngesting }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
    <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><div><h3 className="text-base font-bold text-slate-800">Extracted text</h3><p className="text-xs text-slate-500">Review or edit before adding it to the knowledge base.</p></div></div>
    <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={12} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-500 focus:bg-white resize-y" aria-label="Extracted OCR text" />
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onCopy} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"><Clipboard className="h-3.5 w-3.5" /> Copy Text</button>
      <button type="button" onClick={onDownload} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Download Text</button>
      <button type="button" onClick={onClear} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"><Eraser className="h-3.5 w-3.5" /> Clear</button>
      <button type="button" onClick={onAddToRag} disabled={!text.trim() || isIngesting} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-semibold text-white flex items-center gap-1.5"><>{isIngesting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}</> Add to RAG</button>
    </div>
  </div>
);
