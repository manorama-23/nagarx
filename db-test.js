import { createClient } from '@supabase/supabase-js';

const url = "https://uuladetxfckilymaabbq.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bGFkZXR4ZmNraWx5bWFhYmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MTU0MDIsImV4cCI6MjEwMjI5MTQwMn0.oAlYxdDj3Rvj9wHZgyaBuhALbM5BxUDc42W5k9XInDI";

const supabase = createClient(url, key);

async function test() {
    console.log("Querying authority_updates...");
    const { data, error } = await supabase.from('authority_updates').select('*');
    console.log("Authority Updates:", { data, error });

    console.log("Querying grievances...");
    const { data: gData, error: gError } = await supabase.from('grievances').select('id, title, status').limit(5);
    console.log("Grievances:", { dataCount: gData?.length, gError });

    console.log("Querying storage buckets...");
    const { data: bData, error: bError } = await supabase.storage.listBuckets();
    console.log("Storage Buckets:", { bData, bError });
}

test();
