import { useEffect, useState } from 'react';

import { listProjects } from '../services/projectsService';
import { hasSupabaseConfig, supabaseConfigIssue } from '../services/supabase';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      if (!hasSupabaseConfig) {
        if (active) {
          setError(supabaseConfigIssue ?? 'Supabase is not configured.');
          setProjects([]);
          setLoading(false);
        }
        return;
      }

      try {
        const nextProjects = await listProjects();
        if (active) {
          setProjects(nextProjects);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load projects');
          setProjects([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return {
    projects,
    loading,
    error,
  };
}
