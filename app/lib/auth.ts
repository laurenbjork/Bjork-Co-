import { supabase } from './supabase';

export type AuthUser = {
  id: string;
  email: string;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
  };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
        });
      } else {
        callback(null);
      }
    }
  );

  return subscription;
}
