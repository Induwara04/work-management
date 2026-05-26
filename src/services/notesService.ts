import { supabase } from './supabase';
import { Note, NoteInput } from '../types';

interface NoteRecord {
  id: string;
  title: string;
  content: string;
  linked_task_id: string | null;
  created_at: string;
  updated_at: string;
}

const mapNoteRecord = (record: NoteRecord): Note => ({
  id: record.id,
  title: record.title,
  content: record.content,
  linkedTaskId: record.linked_task_id,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export async function listNotes() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('notes').select('*').order('updated_at', { ascending: false });
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapNoteRecord);
}

export async function createNoteRecord(note: NoteInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: note.title,
      content: note.content,
      linked_task_id: note.linkedTaskId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapNoteRecord(data as NoteRecord);
}

export async function updateNoteRecord(noteId: string, note: NoteInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('notes')
    .update({
      title: note.title,
      content: note.content,
      linked_task_id: note.linkedTaskId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapNoteRecord(data as NoteRecord);
}

export async function deleteNoteRecord(noteId: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) {
    throw error;
  }
}

