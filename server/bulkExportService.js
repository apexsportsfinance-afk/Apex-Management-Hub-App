import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { EventEmitter } from 'events';

export const activeJobs = new Map();

export class BulkExportService extends EventEmitter {
  constructor(supabaseUrl, supabaseServiceKey) {
    super();
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    this.tempBaseDir = 'C:\\apex-temp-exports';
    if (!fs.existsSync(this.tempBaseDir)) {
      try { fs.mkdirSync(this.tempBaseDir, { recursive: true }); } catch (e) {}
    }
  }

  async startJob(jobId, ids, eventName, type = 'pdf') {
    const jobState = {
      id: jobId,
      total: ids.length,
      completed: 0,
      failed: [],
      status: 'processing',
      type: type,
      zipPath: path.join(this.tempBaseDir, `Export_${type.toUpperCase()}_${jobId}.zip`),
    };
    activeJobs.set(jobId, jobState);
    this._runProcessor(jobState, ids, eventName);
    return jobId;
  }

  async _runProcessor(job, ids, eventName) {
    console.log(`\x1b[36m[Job Start ${job.id}]\x1b[0m Processing ${ids.length} records...`);
    const output = fs.createWriteStream(job.zipPath);
    const archive = archiver('zip', { zlib: { level: 1 } });
    
    archive.pipe(output);

    const finalizePromise = new Promise((resolve) => {
      output.on('close', resolve);
      archive.on('error', (err) => {
        console.error(`\x1b[31m[ARCHIVE ERROR]\x1b[0m`, err);
        resolve();
      });
    });

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const appendToArchive = async (buffer, name) => {
        if (!buffer || !Buffer.isBuffer(buffer) || buffer.byteLength < 500) return false;
        return new Promise((resolve) => {
          if (!archive.append(buffer, { name })) {
            archive.once('drain', () => resolve(true));
          } else {
            resolve(true);
          }
        });
      };

      for (const id of ids) {
        let retryCount = 0;
        let jobSucceeded = false;

        while (retryCount < 2 && !jobSucceeded) {
          try {
            const { data: record } = await this.supabase
              .from('accreditations').select('id, first_name, last_name, photo_url').eq('id', id).single();
            
            if (!record) break;

            if (job.type === 'photos') {
              let photoBuffer = null;
              try {
                const resp = await axios.get(record.photo_url, { responseType: 'arraybuffer', timeout: 5000 });
                photoBuffer = Buffer.from(resp.data);
              } catch (e) {
                const pathParts = record.photo_url.split('/public/')[1] || record.photo_url.split('/sign/')[1];
                if (pathParts) {
                    const [bucket, ...rest] = pathParts.split('/');
                    const { data: blob } = await this.supabase.storage.from(bucket).download(rest.join('/'));
                    if (blob) photoBuffer = Buffer.from(await blob.arrayBuffer());
                }
              }

              if (photoBuffer && photoBuffer.byteLength > 100) {
                await appendToArchive(photoBuffer, `${record.first_name}_${id}.jpg`);
                console.log(`\x1b[32m[SUCCESS]\x1b[0m Photo ${id}`);
                jobSucceeded = true;
              }
            } else {
              const success = await this._renderWithRetry(browser, appendToArchive, id);
              if (success) {
                console.log(`\x1b[32m[SUCCESS]\x1b[0m PDF ${id}`);
                jobSucceeded = true;
              }
            }
          } catch (err) {
            console.error(`[Error ${id}]:`, err.message);
          }
          
          if (!jobSucceeded) {
            retryCount++;
            if (retryCount < 2) console.log(`\x1b[33m[RETRYING]\x1b[0m ${id} (${retryCount}/2)`);
            await new Promise(r => setTimeout(r, 2000));
          }
        }

        if (!jobSucceeded) job.failed.push(id);
        job.completed++;
        this.emit('progress', { jobId: job.id, completed: job.completed, total: job.total, status: 'processing' });
      }

      console.log(`\x1b[36m[Job Finalizing ${job.id}]\x1b[0m Closing ZIP...`);
      await archive.finalize();
      await finalizePromise;
      
      job.status = 'complete';
      this.emit('complete', { jobId: job.id, downloadUrl: `/api/bulk-download/${job.id}/file` });

    } catch (err) {
      console.error(`[Fatal]:`, err);
      job.status = 'error';
    } finally {
      if (browser) await browser.close();
    }
  }

  async _renderWithRetry(browser, appendToArchive, id) {
    const page = await browser.newPage();
    try {
      const { data: record } = await this.supabase
        .from('accreditations').select('first_name, last_name').eq('id', id).single();
      const fileName = `${record.first_name || 'unknown'}_${id}.pdf`;
      const printUrl = `http://localhost:5173/print-secure/${id}?skipAuth=true`;
      
      // Increased timeout and changed to 'load' for more reliable local rendering
      await page.goto(printUrl, { waitUntil: 'load', timeout: 45000 });
      await new Promise(r => setTimeout(r, 2000)); // Ensure styles are applied
      
      const pdfBuffer = await page.pdf({ format: 'A6', printBackground: true, timeout: 45000 });
      if (pdfBuffer && pdfBuffer.byteLength > 500) {
        return await appendToArchive(pdfBuffer, fileName);
      }
      return false;
    } catch (e) { 
      return false; 
    } finally { await page.close(); }
  }
}
