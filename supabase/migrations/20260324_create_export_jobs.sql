-- Migration: Create Export Jobs Table for Background PDF Processing
-- Filename: supabase/migrations/20260324_create_export_jobs.sql

CREATE TABLE IF NOT EXISTS public.export_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    job_type VARCHAR(50) DEFAULT 'bulk_pdf_accreditations',
    total_items INTEGER NOT NULL,
    processed_items INTEGER DEFAULT 0,
    file_url TEXT, -- URL to the generated ZIP/PDF in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

-- Admins basically have full access
CREATE POLICY "Admins can view and manage all export jobs"
ON public.export_jobs
FOR ALL
TO authenticated
USING ( auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated' );

-- Create the Storage Bucket for exported PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy allowing authenticated admins to read/write exports
CREATE POLICY "Admins manage exports bucket"
ON storage.objects
FOR ALL
TO authenticated
USING ( bucket_id = 'exports' );
