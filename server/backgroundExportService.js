import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export class EnterpriseBackgroundExporter {
  constructor(supabaseUrl, supabaseServiceKey) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    this.tempDir = path.join(process.cwd(), 'server', 'temp_exports');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async processBulkExportJob(jobId, ids, eventName, targetEmail) {
    try {
      console.log(`[JOB ${jobId}] Starting background export for ${ids.length} accreditations...`);
      const { data: records, error } = await this.supabase
        .from('accreditations')
        .select('*')
        .in('id', ids);

      if (error) throw new Error("Failed to fetch accreditation DB records: " + error.message);
      
      const zipPath = path.join(this.tempDir, `Export_${jobId}.zip`);
      const outputStream = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 6 } });

      const archivePromise = new Promise((resolve, reject) => {
        outputStream.on('close', () => resolve(zipPath));
        archive.on('finish', () => console.log('Archive stream finished zipping.'));
        archive.on('error', (err) => reject(err));
      });

      archive.pipe(outputStream);

      console.log(`[JOB ${jobId}] Launching high-performance Chromium engine...`);
      const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Sequential processing ensures the archiver has time to append buffers
      for (const acc of records) {
        console.log(`[JOB ${jobId}] Capturing card for ${acc.first_name || acc.id}...`);
        const page = await browser.newPage();
        try {
          await page.setCacheEnabled(false);
          const printUrl = `http://localhost:5173/print-secure/${acc.id}?skipAuth=true`;
          console.log(`[BROWSER] Visiting: ${printUrl}`);
          
          await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 90000 });
          await page.waitForSelector('h2, .text-xl', { timeout: 15000 });
          await new Promise(r => setTimeout(r, 8000)); // Patience for photo

          const screenshot = await page.screenshot({ fullPage: true, type: 'jpeg', quality: 100 });
          archive.append(screenshot, { name: `${acc.id.slice(0,4)}_${(acc.first_name || 'Card').replace(/[^a-z]/gi, '')}.jpg` });
          
          await page.close();
          // Vital: Give the archiver internal drain time
          await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
          console.error(`[PDF Error] Failed for ID ${acc.id}:`, err);
          await page.close();
        }
      }

      console.log(`[JOB ${jobId}] Finalizing archive...`);
      await archive.finalize();
      const finalZipPath = await archivePromise;
      await browser.close();
      console.log(`[JOB ${jobId}] ZIP fully compiled at: ${finalZipPath}`);
      return finalZipPath;

    } catch (err) {
      console.error(`[JOB ${jobId}] Fatal Export Error:`, err);
      return false;
    }
  }
}
