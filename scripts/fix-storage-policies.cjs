const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.hdpqsebjtuljtvkyoiyn:sb_secret_Dz8RGMWPKJRUiCaZYmaruQ_ED3n9ANR@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixStoragePolicies() {
  try {
    await pool.query(`
      -- Ensure bucket is public
      UPDATE storage.buckets SET public = true WHERE id = 'avatars';
      
      -- Drop old conflicting policies if any
      DROP POLICY IF EXISTS "Allow public avatar access" ON storage.objects;
      DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
      DROP POLICY IF EXISTS "Avatar Uploads" ON storage.objects;
      
      -- Create permissive policy for avatars bucket
      CREATE POLICY "Allow public avatar access" 
      ON storage.objects 
      FOR ALL 
      TO public 
      USING (bucket_id = 'avatars') 
      WITH CHECK (bucket_id = 'avatars');
    `);
    console.log('✅ Storage policies for avatars created successfully!');
  } catch (err) {
    console.error('Storage policy error:', err.message);
  } finally {
    await pool.end();
  }
}

fixStoragePolicies();
