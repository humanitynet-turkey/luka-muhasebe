import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsgtfwyotrtqbzvueogh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZ3Rmd3lvdHJ0cWJ6dnVlb2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDUwNTksImV4cCI6MjA3NjIyMTA1OX0.SqWEvUSAdUEj4m0VbWxB5ws5638Ztnz1fp4ZKr071go';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);