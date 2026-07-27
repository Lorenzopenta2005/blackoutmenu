const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[FATAL] SUPABASE_URL e SUPABASE_KEY non trovati in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function formatDescription(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/(?<!\d),(?!\d)\s*|,\s+/g, ' - ')
    .replace(/\s*-\s*(?:-\s*)+/g, ' - ')
    .trim();
}

async function run() {
  console.log('Fetching items from menu_generale...');
  const { data: items, error } = await supabase.from('menu_generale').select('*');
  if (error) {
    console.error('Error fetching items:', error);
    process.exit(1);
  }

  console.log(`Trovati ${items.length} elementi.`);
  let updatedCount = 0;

  for (const item of items) {
    if (!item.description) continue;

    // Check if item was ruined by previous run (e.g. 1 - 00 € or 43 - 4%)
    let currentDesc = item.description
      .replace(/(\d)\s*-\s*(\d)/g, '$1,$2'); // Fix 1 - 00 -> 1,00 if needed

    const formatted = formatDescription(currentDesc);
    if (formatted !== item.description) {
      console.log(`[UPDATE ID ${item.id}] "${item.name}"`);
      console.log(`   PRIMA: "${item.description}"`);
      console.log(`   DOPO:  "${formatted}"`);

      const { error: updateError } = await supabase
        .from('menu_generale')
        .update({ description: formatted })
        .eq('id', item.id);

      if (updateError) {
        console.error(`   ERRORE durante l'aggiornamento ID ${item.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`\nCompletato! Aggiornati/ripristinati ${updatedCount} elementi nel database.`);
}

run();
