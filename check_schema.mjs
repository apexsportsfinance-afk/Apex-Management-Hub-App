import dotenv from 'dotenv';
dotenv.config();

const url = `${process.env.VITE_SUPABASE_URL}/rest/v1/?apikey=${process.env.VITE_SUPABASE_ANON_KEY}`;

async function check() {
  const res = await fetch(url);
  const json = await res.json();
  const table = json.definitions.athlete_events.properties;
  console.log('Columns:', Object.keys(table).join(', '));
}

check();
