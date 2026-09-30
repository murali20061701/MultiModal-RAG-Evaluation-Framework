import React from 'react';
import { CheckCircle2, Database } from 'lucide-react';

interface RAGIngestionStatusProps { name: string; characters: number; chunks: number; processingTime: number; }

export const RAGIngestionStatus: React.FC<RAGIngestionStatusProps> = ({ name, characters, chunks, processingTime }) => (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
    <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><h3 className="font-bold text-sm">Indexed and ready for RAG questions</h3></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div><p className="text-emerald-700/70">Document name</p><p className="font-semibold truncate" title={name}>{name}</p></div>
      <div><p className="text-emerald-700/70">Extracted characters</p><p className="font-semibold">{characters.toLocaleString()}</p></div>
      <div><p className="text-emerald-700/70">Chunks</p><p className="font-semibold">{chunks}</p></div>
      <div><p className="text-emerald-700/70">Processing time</p><p className="font-semibold">{processingTime.toFixed(2)}s</p></div>
    </div>
    <p className="mt-3 text-xs flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> Ingestion status: <strong>success</strong> — ask about this document from Chat &amp; Observatory.</p>
  </div>
);
