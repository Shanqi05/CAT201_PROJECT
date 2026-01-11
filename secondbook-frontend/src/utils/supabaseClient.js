import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuiiesrnwojtavinvjqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aWllc3Jud29qdGF2aW52anFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTUzNjgsImV4cCI6MjA4MjM5MTM2OH0.Xtc6ugdmvb9bAy_cUH18yIQYUEo2FhCXuCgsKB8f6c8';

export const supabase = createClient(supabaseUrl, supabaseKey);