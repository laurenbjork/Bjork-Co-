import { supabase } from './supabase';

export type AuthUser = {
  id: string;
  email: string;
};

export async function signInWithEmail(email: string, password: string) {
  console.log('=== LOGIN DEBUG ===');
  console.log('Email:', email);
  console.log('Password length:', password.length);
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      console.error('Supabase Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
      });
      throw error;
    }

    console.log('Login SUCCESS!');
    console.log('User:', data.user?.email);
    console.log('Session exists:', !!data.session);
    return data;
  } catch (err: any) {
    console.error('Caught error:', err);
    throw err;
  }
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
