import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const url = 'https://cuqzrphvqiaaprqvfzdz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cXpycGh2cWlhYXBycXZmemR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc1MzMzOSwiZXhwIjoyMTAzMzI5MzM5fQ.yQ1iZ-z0eYmDwWAq7hOrZfoEOKFHsklWkR2LH3oUK4s';
const supabase = createClient(url, key);

// Read from the project directory
const rawData = fs.readFileSync('c:/Users/keitaro/Desktop/DVC_JA_Rating_Project/prorater/src/data.json', 'utf-8');
const data = JSON.parse(rawData);

async function seed() {
  console.log(`Starting upload of ${data.length} records...`);
  
  // Supabase limits inserts to 1000 rows at a time, we have ~500 so one batch is fine
  const { data: inserted, error } = await supabase
    .from('reviews')
    .insert(data.map(d => {
        const row = { ...d };
        delete row.id;
        return row;
    }))
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log(`Successfully inserted ${inserted.length} records!`);
  }
}

seed();
