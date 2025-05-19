
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Supabase connection details
const supabaseUrl = 'https://gyheyxmcrbxsexobnipy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aGV5eG1jcmJ4c2V4b2JuaXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ1ODA1MSwiZXhwIjoyMDYyMDM0MDUxfQ.pxmGVv0Oz85M2i-Y_5PmGN9Tc-aNd-7Mh3LqDoZYnL8';

// Create Supabase client with connection handling
export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection on app initialization
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('Supabase connection established successfully');
  }
});
