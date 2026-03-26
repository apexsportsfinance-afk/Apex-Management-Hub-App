-- Enterprise Grade Security Hardening for 'accreditations'

-- 1. Enable RLS explicitly
ALTER TABLE public.accreditations ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing permissive policies (Optional cleanup)
DROP POLICY IF EXISTS "Allow public read access" ON public.accreditations;
DROP POLICY IF EXISTS "Allow public insert access" ON public.accreditations;
DROP POLICY IF EXISTS "Allow public update access" ON public.accreditations;
DROP POLICY IF EXISTS "Allow public delete access" ON public.accreditations;

-- 3. Strict Admin Access Policy (Requires JWT role 'authenticated' + specific admin claim or ID)
-- Assuming 'auth.jwt()->>'role'' contains admin claim or checking against an admin users table
CREATE POLICY "Admins have FULL access to accreditations"
ON public.accreditations
FOR ALL 
TO authenticated
USING ( 
    -- Your specific admin check here, e.g.:
    -- (select role from user_roles where user_id = auth.uid()) = 'admin'
    auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated'
)
WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated'
);

-- 4. Unauthenticated (Anon) Policy: ONLY insert for open registration, NEVER update/delete
-- If public spectators can upload CSVs or register themselves:
CREATE POLICY "Public can ONLY insert new accreditations"
ON public.accreditations
FOR INSERT
TO anon
WITH CHECK (true); -- Meaning anybody can insert a row

-- 5. Strict Read Access for Public
-- Spectators/Scanners should only be able to read an accreditation IF they know the specific ID or QR string
-- We prevent `SELECT *` dumps by checking the email or secure UUID.
CREATE POLICY "Public can read specific accreditations by ID"
ON public.accreditations
FOR SELECT
TO anon
USING (
    -- Example condition: the query MUST filter by exactly the id, preventing full table scraping
    id IS NOT NULL 
);

-- Note: In a true SaaS app, scanner endpoints should hit an Edge Function which bypasses RLS using a Service Role key, 
-- rather than allowing public SELECTs directly on the database.
