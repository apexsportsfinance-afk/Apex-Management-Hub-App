import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { accreditationIds, eventName } = await req.json();

    // 1. Setup Supabase Client securely
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Track Background Job
    const { data: job, error: jobErr } = await supabase
      .from('export_jobs')
      .insert({
        total_items: accreditationIds.length,
        status: 'processing',
        job_type: 'bulk_badge_pdf'
      })
      .select()
      .single();

    if (jobErr) throw jobErr;

    // 3. Launch Deno-Puppeteer (LOCAL CHROMIUM)
    // This will download Chromium into your local Deno cache automatically
    // No external BROWSERLESS key required!
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for running inside local Docker sandboxes
    });

    const page = await browser.newPage();
    
    // 4. Inject Tailwind & Accreditation HTML
    const contentHtml = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white p-8 font-['Inter']">
          <h1 class="text-4xl font-['Manrope'] font-bold text-slate-900 mb-6">Accreditation Tickets: ${eventName}</h1>
          ${accreditationIds.map((id, index) => `
            <div class="border-2 border-slate-200 rounded-xl p-6 mb-8 break-inside-avoid shadow-lg relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
                <h2 class="text-xs uppercase tracking-widest text-slate-400 mb-2">PASS HOLDER</h2>
                <h3 class="text-2xl font-bold text-slate-900 leading-tight">Accreditation ID: ${id}</h3>
                <p class="mt-4 text-sm text-slate-500 bg-slate-100 py-1 px-3 rounded-md inline-block font-mono">INDEX #${index+1}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Wait until networkidle0 ensures Tailwind CSS finishes compiling and downloading fonts
    await page.setContent(contentHtml, { waitUntil: 'networkidle0' });

    // 5. Build the clean PDF locally
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px' }
    });

    await browser.close();

    // 6. Upload output to the newly created 'exports' storage bucket
    const fileName = `badges_${job.id}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('exports')
      .upload(fileName, pdfBuffer, { contentType: 'application/pdf' });

    if (uploadError) throw uploadError;

    // 7. Finish Job Tracking
    await supabase.from('export_jobs')
      .update({ status: 'completed', file_url: fileName, processed_items: accreditationIds.length })
      .eq('id', job.id);

    return new Response(JSON.stringify({ success: true, jobId: job.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error) {
    console.error("Local Puppeteer Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
});
