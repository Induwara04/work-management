import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getProjectRefFromUrl(url: string) {
  try {
    return new URL(url).hostname.split('.')[0] ?? null;
  } catch {
    return null;
  }
}

function getProjectRefFromAnonKey(key: string) {
  try {
    const payload = key.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(window.atob(normalized));
    return typeof json.ref === 'string' ? json.ref : null;
  } catch {
    return null;
  }
}

export const supabaseConfigIssue = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase environment variables are missing.';
  }

  const urlRef = getProjectRefFromUrl(supabaseUrl);
  const keyRef = getProjectRefFromAnonKey(supabaseAnonKey);
  if (urlRef && keyRef && urlRef !== keyRef) {
    return `Supabase URL project ref "${urlRef}" does not match anon key ref "${keyRef}".`;
  }

  return null;
})();

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey && !supabaseConfigIssue);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false,
      },
    })
  : null;
