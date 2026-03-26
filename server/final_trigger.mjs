import { EnterpriseBackgroundExporter } from './backgroundExportService.js';
import dotenv from 'dotenv';
dotenv.config();

const exporter = new EnterpriseBackgroundExporter(
    process.env.VITE_SUPABASE_URL, 
    process.env.VITE_SUPABASE_ANON_KEY
);

console.log('--- STARTING ABSOLUTE FINAL ESM AUDIT (1 CARD) ---');
exporter.processBulkExportJob(
    'ULTIMATE_ESM_VERIF', 
    ['0117b281-fc42-466e-81d5-daa82e7679cc'], 
    'Final DIAC 2026 Audit', 
    'basit@example.com'
).then(res => console.log('Job Completed Success:', res))
 .catch(err => console.error('Job Crashed Fatal:', err));
