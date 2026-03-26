const { EnterpriseBackgroundExporter } = require('./server/backgroundExportService.js');
require('dotenv').config();

const exporter = new EnterpriseBackgroundExporter(
    process.env.VITE_SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

exporter.processBulkExportJob(
    'FINAL_AUDIT_SUCCESS', 
    ['000c0274-1428-482a-a034-31eeca297e6e'], 
    'Dubai International Aquatics Championship 2026', 
    'basit.shah@example.com'
).then(res => console.log('Job Result:', res))
 .catch(err => console.error('Job Crash:', err));
