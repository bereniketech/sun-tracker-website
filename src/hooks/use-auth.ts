"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const supabase = getBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setState({ user: data.session?.user ?? null, isLoading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, isLoading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await getBrowserClient().auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signUp(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await getBrowserClient().auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut(): Promise<void> {
    await getBrowserClient().auth.signOut();
  }

  async function getAccessToken(): Promise<string | null> {
    const { data } = await getBrowserClient().auth.getSession();
    return data.session?.access_token ?? null;
  }

  return { ...state, signIn, signUp, signOut, getAccessToken };
}
