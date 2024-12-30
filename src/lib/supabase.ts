import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpaebbmegujkivzwmrtw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwYWViYm1lZ3Vqa2l2endtcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NDgxNDEsImV4cCI6MjA1MDUyNDE0MX0.faS1wYTIZHFzFjx0UgoR-8QVVv_qi2UA10gNQa5QoBk';

export const supabase = createClient(supabaseUrl, supabaseKey);