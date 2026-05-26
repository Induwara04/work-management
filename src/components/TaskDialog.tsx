import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { Project, Task, TaskFormValues, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '../types';
import { toDateTimeInputValue } from '../utils/date';

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<void>;
}

function getDefaultValues(projects: Project[]): TaskFormValues {
  return {
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    category: 'Feature',
    dueDate: '',
    projectId: projects[0]?.id ?? '',
    tags: '',
  };
}

export function TaskDialog({ open, task, projects, onClose, onSave }: TaskDialogProps) {
  const [values, setValues] = useState<TaskFormValues>(getDefaultValues(projects));

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate: toDateTimeInputValue(task.dueDate),
        projectId: task.projectId,
        tags: task.tags.join(', '),
      });
      return;
    }

    setValues(getDefaultValues(projects));
  }, [task, projects]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            autoFocus
            fullWidth
            label="Title"
            value={values.title}
            onChange={(event) => setValues({ ...values, title: event.target.value })}
          />
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            value={values.description}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
          />

          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={values.status}
                onChange={(event) => setValues({ ...values, status: event.target.value as TaskFormValues['status'] })}
              >
                {TASK_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={values.priority}
                onChange={(event) =>
                  setValues({ ...values, priority: event.target.value as TaskFormValues['priority'] })
                }
              >
                {TASK_PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={values.category}
                onChange={(event) =>
                  setValues({ ...values, category: event.target.value as TaskFormValues['category'] })
                }
              >
                {TASK_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Project"
                select
                value={values.projectId}
                onChange={(event) => setValues({ ...values, projectId: event.target.value })}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Due Date"
                type="datetime-local"
                value={values.dueDate}
                onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            helperText="Comma-separated tags"
            label="Tags"
            value={values.tags}
            onChange={(event) => setValues({ ...values, tags: event.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => void onSave(values)}>
          Save Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}

