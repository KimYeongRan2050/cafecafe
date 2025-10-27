import { supabase } from './supabaseClient';

export async function signIn(name, password, email) {
  const { data, error } = await supabase.auth.signInWithPassword({name, email, password });
  if (error) throw error;
  return data;
}