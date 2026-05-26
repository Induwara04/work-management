import { useCallback, useEffect, useState } from 'react';

import { createNoteRecord, deleteNoteRecord, listNotes, updateNoteRecord } from '../services/notesService';
import { hasSupabaseConfig, supabaseConfigIssue } from '../services/supabase';
import { Note, NoteInput } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNotes() {
      if (!hasSupabaseConfig) {
        if (active) {
          setError(supabaseConfigIssue ?? 'Supabase is not configured.');
          setNotes([]);
          setLoading(false);
        }
        return;
      }

      try {
        const nextNotes = await listNotes();
        if (active) {
          setNotes(nextNotes);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load notes');
          setNotes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      active = false;
    };
  }, []);

  const createNote = useCallback(async (input: NoteInput) => {
    const nextNote = await createNoteRecord(input);

    setNotes((currentNotes) => [nextNote, ...currentNotes]);
    return nextNote;
  }, []);

  const updateNote = useCallback(async (noteId: string, input: NoteInput) => {
    const nextNote = await updateNoteRecord(noteId, input);

    setNotes((currentNotes) => currentNotes.map((note) => (note.id === noteId ? nextNote : note)));
    return nextNote;
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    await deleteNoteRecord(noteId);
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
  }, []);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
  };
}
