const url = "https://dixelomafeobabahqeqg.supabase.co/rest/v1/athlete_events?accreditation_id=not.is.null";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeGVsb21hZmVvYmFiYWhxZXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzA4MzYsImV4cCI6MjA4NjkwNjgzNn0.YD1lj0T6kFoM2XyeYonIC3bmLiPkKBvmXEHEr5VMaGM";

async function purge() {
  console.log("Sending DELETE request to Purge Ghost Events...");
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });

    if (res.ok) {
      console.log("Purge successful! Status:", res.status);
    } else {
      console.error("Purge failed. Status:", res.status);
      const text = await res.text();
      console.error(text);
    }
  } catch (err) {
    console.error("Fetch threw error:", err);
  }
}

purge();
