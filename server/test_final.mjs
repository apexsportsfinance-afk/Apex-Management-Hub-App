import { EnterpriseBackgroundExporter } from './backgroundExportService.js';
import dotenv from 'dotenv';
dotenv.config();

const exporter = new EnterpriseBackgroundExporter(
    process.env.VITE_SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('--- STARTING FINAL AUDIT BATCH (3 CARDS) ---');
exporter.processBulkExportJob(
    'FINAL_AUDIT_3', 
    ['000c0274-1428-482a-a034-31eeca297e6e', '000c439f-ea1e-4cb8-86d1-0309e3e3eb4c', '000d68f7-7b19-4b6e-8212-0051666e6b6b'], 
    'Final Final Test', 
    'basit@example.com'
).then(res => console.log('Job Result:', res))
 .catch(err => console.error('Job Crash:', err));
