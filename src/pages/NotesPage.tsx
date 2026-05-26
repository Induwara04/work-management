import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { useWorkManager } from '../hooks/useWorkManager';

export function NotesPage() {
  const { notes, tasks, createNote, updateNote, deleteNote } = useWorkManager();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState<string>('');

  useEffect(() => {
    if (!editingId) {
      setTitle('');
      setContent('');
      setLinkedTaskId('');
      return;
    }

    const activeNote = notes.find((note) => note.id === editingId);
    if (!activeNote) {
      return;
    }

    setTitle(activeNote.title);
    setContent(activeNote.content);
    setLinkedTaskId(activeNote.linkedTaskId ?? '');
  }, [editingId, notes]);

  async function handleSave() {
    if (!title.trim()) {
      return;
    }

    if (editingId) {
      await updateNote(editingId, {
        title: title.trim(),
        content: content.trim(),
        linkedTaskId: linkedTaskId || null,
      });
    } else {
      await createNote({
        title: title.trim(),
        content: content.trim(),
        linkedTaskId: linkedTaskId || null,
      });
    }

    setEditingId(null);
    setTitle('');
    setContent('');
    setLinkedTaskId('');
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h5">Notes</Typography>
        <Typography color="text.secondary" variant="body2">
          Keep meeting notes, release notes, and work context close to the tasks they support.
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{editingId ? 'Edit Note' : 'New Note'}</Typography>
                <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
                <TextField
                  select
                  label="Linked Task"
                  value={linkedTaskId}
                  onChange={(event) => setLinkedTaskId(event.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {tasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.title}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Content"
                  minRows={8}
                  multiline
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <Button startIcon={<SaveRoundedIcon />} variant="contained" onClick={() => void handleSave()}>
                  {editingId ? 'Update Note' : 'Save Note'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item lg={8} xs={12}>
          {notes.length === 0 ? (
            <EmptyState title="No notes yet" description="Create a note for meeting prep, release context, or reminders." />
          ) : (
            <Grid container spacing={2}>
              {notes.map((note) => (
                <Grid item key={note.id} md={6} xs={12}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Typography variant="h6">{note.title}</Typography>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => setEditingId(note.id)}>
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => void deleteNote(note.id)}>
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                        <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {note.content}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {note.linkedTaskId
                            ? `Linked to: ${tasks.find((task) => task.id === note.linkedTaskId)?.title ?? 'Task'}`
                            : 'Standalone note'}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
