const { EnterpriseBackgroundExporter } = require('./backgroundExportService.js');
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.log('--- CRITICAL: .env file missing or unreadable! ---');
}

const exporter = new EnterpriseBackgroundExporter(
    process.env.VITE_SUPABASE_URL, 
    process.env.VITE_SUPABASE_ANON_KEY
);

console.log('--- STARTING ABSOLUTE FINAL AUDIT (1 CARD) ---');
exporter.processBulkExportJob(
    'ULTIMATE_VERIF', 
    ['0117b281-fc42-466e-81d5-daa82e7679cc'], 
    'DIAC 2026 Audit', 
    'basit@example.com'
).then(res => console.log('Job Completed:', res))
 .catch(err => console.error('Job Crashed:', err));
