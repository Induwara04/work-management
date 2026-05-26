import { Card, CardContent, Stack, Typography } from '@mui/material';

import { EmptyState } from '../components/EmptyState';
import { TaskTimeline } from '../components/TaskTimeline';
import { useWorkManager } from '../hooks/useWorkManager';

export function CalendarPage() {
  const { tasks, projects } = useWorkManager();

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h5">Calendar / Timeline</Typography>
        <Typography color="text.secondary" variant="body2">
          Grouped by date with visual emphasis on today, tomorrow, overdue, and upcoming work.
        </Typography>
      </div>

      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState
              title="Timeline is empty"
              description="Add a due date to tasks to build your work calendar."
            />
          ) : (
            <TaskTimeline projects={projects} tasks={tasks} />
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
