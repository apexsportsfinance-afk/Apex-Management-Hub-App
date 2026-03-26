import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BulkExportService, activeJobs } from './server/bulkExportService.js';

// 1. ESM Context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load ENV BEFORE any service initialization
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('\x1b[36m[BOOT]\x1b[0m Supabase URL:', process.env.VITE_SUPABASE_URL ? 'Loaded' : 'MISSING');
console.log('\x1b[36m[BOOT]\x1b[0m Primary Key (Anon):', process.env.VITE_SUPABASE_ANON_KEY ? 'Loaded' : 'MISSING');

// 3. Initialize Service with confirmed ANON key (Service Key placeholder was corrupt)
const exportService = new BulkExportService(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.post('/api/bulk-download', async (req, res) => {
  const { accreditationIds, eventName, type = 'pdf' } = req.body;
  if (!accreditationIds?.length) return res.status(400).json({ error: 'No IDs selected' });
  const batchId = `BATCH_${Date.now()}`;
  await exportService.startJob(batchId, accreditationIds, eventName || 'Bulk', type);
  res.json({ batchId, total: accreditationIds.length });
});

app.get('/api/bulk-download/:batchId/progress', (req, res) => {
  const { batchId } = req.params;
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
  const onProgress = (data) => { if (data.jobId === batchId) res.write(`data: ${JSON.stringify(data)}\n\n`); };
  const onComplete = (data) => {
    if (data.jobId === batchId) {
      res.write(`data: ${JSON.stringify({ status: 'complete', downloadUrl: data.downloadUrl })}\n\n`);
      res.end();
    }
  };
  exportService.on('progress', onProgress);
  exportService.on('complete', onComplete);
  req.on('close', () => {
    exportService.removeListener('progress', onProgress);
    exportService.removeListener('complete', onComplete);
  });
});

app.get('/api/bulk-download/:batchId/file', (req, res) => {
  const { batchId } = req.params;
  const job = activeJobs.get(batchId);
  if (!job || !fs.existsSync(job.zipPath)) return res.status(404).json({ error: 'Not found.' });
  res.download(job.zipPath, `Apex_${job.type.toUpperCase()}_${batchId}.zip`, (err) => {
    if (!err) {
      setTimeout(() => { if (fs.existsSync(job.zipPath)) fs.unlinkSync(job.zipPath); activeJobs.delete(batchId); }, 60000);
    }
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\x1b[32m[SERVER START]\x1b[0m Bulk Export Operational at http://localhost:${PORT}`);
  console.log(`[STABILITY] Holding event loop active...`);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
