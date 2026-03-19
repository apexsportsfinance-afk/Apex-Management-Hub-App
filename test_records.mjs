import fs from 'fs';
import { JSDOM } from 'jsdom';

// Notice spaces in the path are represented identically to the local filesystem
const htmlContent = fs.readFileSync("C:\\Users\\Administrator\\Downloads\\Heat Sheet - DIAC 2026.htm", 'utf-8');

const doc = new JSDOM(htmlContent).window.document;
const topLevels = doc.body.children;

const eventRecordsRegex = /^([0-9]{1,2}(?:\s*-\s*[0-9]{1,2})?|[0-9]{1,2}\s*&\s*[A-Za-z]+|[A-Za-z0-9\s&]+?)\s+([A-Z0-9_-]+):\s+(\d{1,2}:\d{2}\.\d{2}|\d{2}\.\d{2})/;

let inRecords = false;

for (let i = 0; i < topLevels.length; i++) {
  const el = topLevels[i];
  if (el.tagName === 'PRE') {
    const lines = (el.textContent || '').split('\n');
    lines.forEach(line => {
       const cleanLine = line.trim();
       if (!cleanLine) return;
       
       if (cleanLine.toLowerCase().includes('event') && cleanLine.match(/Event\s+(\d+)\s+(.+)/i) && !cleanLine.includes('(Event')) {
          console.log("\nFOUND EVENT:", cleanLine);
          inRecords = true;
       } else if (inRecords && !cleanLine.toLowerCase().includes('event') && !cleanLine.toLowerCase().includes('heat') && !cleanLine.toLowerCase().includes('lane') && !cleanLine.toLowerCase().includes('name')) {
          
          // Mimic cells logic
          const cells = cleanLine.split(/\s{2,}/);
          const recordStr = cells.join(" ").trim();
          
          const recordMatch = recordStr.match(eventRecordsRegex);
          if (recordMatch) {
             console.log("  RECORD =>", recordMatch[0]);
             console.log("    Age:", recordMatch[1]);
             console.log("    Acronym:", recordMatch[2]);
             console.log("    Time:", recordMatch[3]);
          }
       } else if (cleanLine.match(/Heat\s+\d+/i) || cleanLine.toLowerCase().includes('name')) {
          inRecords = false;
       }
    });
  }
}
