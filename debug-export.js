import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log("Starting Debug Puppeteer...");
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        console.log("Navigating to React app...");
        await page.goto('http://localhost:5173/admin/accreditations?event=c97c7235-ceff-4fc6-b5b3-7fa64ec38aeb', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log("Waiting for user to login if needed, taking screenshot...");
        await page.screenshot({ path: 'artifacts/debug_button_test.png', fullPage: true });

        console.log("Attempting to intercept API calls...");
        page.on('response', resp => {
            if (resp.url().includes('bulk-pdf')) {
                console.log('Got response from /api/bulk-pdf! Status:', resp.status());
            }
        });
        
        page.on('console', msg => {
            console.log('React Console Log:', msg.text());
        });

        // We can't easily click because they need to be logged into Supabase.
        // But we can just make the fetch request identical to the React app directly from Node!
        console.log("Test finished.");
        await browser.close();
    } catch (e) {
        console.error("Debug script failed:", e);
    }
})();
