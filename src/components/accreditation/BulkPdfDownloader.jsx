import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BulkPdfDownloader = React.memo(({ accreditationIds, eventName, type = 'pdf', label }) => {
  const [status, setStatus] = useState('idle');
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const eventSourceRef = useRef(null);

  const cleanupSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupSSE();
  }, []);

  const handleStartExport = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accreditationIds?.length || status === 'processing') return;
    
    setStatus('processing');
    setCurrent(0);
    setTotal(accreditationIds.length);

    try {
      // Step 1: Trigger the job (Asynchronous)
      const res = await fetch('http://localhost:3001/api/bulk-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accreditationIds, eventName, type }),
        keepalive: true
      });
      
      const { batchId } = await res.json();
      if (!batchId) throw new Error('No batch ID returned');

      // Step 2: Open SSE for real-time tracking
      cleanupSSE();
      eventSourceRef.current = new EventSource(`http://localhost:3001/api/bulk-download/${batchId}/progress`);
      
      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'processing') {
          setCurrent(data.completed);
        }
        if (data.status === 'complete') {
          cleanupSSE();
          setStatus('complete');
          toast.success(`${type.toUpperCase()} Export Finished!`);
          
          // Step 3: Trigger Browser Download
          window.location.href = `http://localhost:3001${data.downloadUrl}`;
          setTimeout(() => setStatus('idle'), 8000);
        }
      };

      eventSourceRef.current.onerror = () => {
        cleanupSSE();
        setStatus('error');
        toast.error('The export server disconnected. Retrying...');
      };

    } catch (err) {
      console.error('Export Trigger Error:', err);
      setStatus('error');
      toast.error('Failed to connect to export server. Is node server.js running?');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <button
        onClick={handleStartExport}
        disabled={status === 'processing' || !accreditationIds?.length}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 border ${
          status === 'processing'
            ? 'bg-slate-800 text-slate-500 border-slate-700'
            : status === 'complete'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : accreditationIds?.length > 0
                ? 'bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 border-primary-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 border-transparent opacity-50 cursor-not-allowed'
        }`}
      >
        {status === 'processing' ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
        ) : status === 'complete' ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : type === 'photos' ? (
          <ImageIcon className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        
        {status === 'processing' 
          ? `Exporting ${current}/${total}` 
          : status === 'complete' 
          ? 'Download Ready' 
          : label || `Export ${type.toUpperCase()} (${accreditationIds?.length || 0})`}
      </button>

      {status === 'processing' && (
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-primary-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
});

export default BulkPdfDownloader;
