import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';

/**
 * Priority 2: High-Performance Bulk PDF Export
 * This runs entirely on the sever, preventing the browser from crashing.
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { accreditationIds, eventName } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Bypasses RLS!
    );

    // 1. Fetch data safely
    const { data: records } = await supabaseAdmin
      .from('accreditations')
      .select('*')
      .in('id', accreditationIds);

    // 2. Generate PDF in-memory (0 browser blocking!)
    const pdf = new jsPDF();
    records.forEach((record, idx) => {
      pdf.setFontSize(22);
      pdf.text(`ACCREDITATION: ${eventName}`, 20, 30);
      pdf.setFontSize(14);
      pdf.text(`Name: ${record.name}`, 20, 50);
      pdf.text(`Role: ${record.role}`, 20, 60);
      
      if (idx < records.length - 1) {
        pdf.addPage();
      }
    });

    // 3. Output to Buffer
    const pdfBytes = pdf.output('arraybuffer');

    // 4. Save to Supabase Storage temporarily
    const fileName = `bulk_exports/${eventName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    
    await supabaseAdmin.storage
      .from('exports')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
      });

    // 5. Get Download Link (or email it)
    const { data: linkData } = await supabaseAdmin.storage
      .from('exports')
      .createSignedUrl(fileName, 3600); 

    // 6. Return the download URL instantly so the React app can just show an <a> tag!
    return new Response(
      JSON.stringify({ success: true, downloadUrl: linkData.signedUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
