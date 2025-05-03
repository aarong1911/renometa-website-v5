import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rgdlonfxqigbtaumasnv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZGxvbmZ4cWlnYnRhdW1hc252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzA1NjUsImV4cCI6MjA2MDQ0NjU2NX0.j4TXG9eVbWju7YEv6cX6JANC97ht68mfBQjBI1jtSH8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
