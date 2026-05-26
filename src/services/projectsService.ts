import { supabase } from './supabase';
import { Project } from '../types';

interface ProjectRecord {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

const mapProjectRecord = (record: ProjectRecord): Project => ({
  id: record.id,
  name: record.name,
  description: record.description ?? '',
  color: record.color,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export async function listProjects() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('projects').select('*').order('name');
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapProjectRecord);
}

