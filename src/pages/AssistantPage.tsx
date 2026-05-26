import { Chip, Grid, Stack, Typography } from '@mui/material';

import { AIWorkAssistantCard } from '../components/AIWorkAssistantCard';
import { SummaryCard } from '../components/SummaryCard';
import { useWorkManager } from '../hooks/useWorkManager';

export function AssistantPage() {
  const { tasks, projects, suggestedTask } = useWorkManager();
  const blockedTasks = tasks.filter((task) => task.status === 'Blocked');
  const releaseTasks = tasks.filter((task) => task.category === 'Release' && task.status !== 'Done');

  return (
    <Stack spacing={3}>
      <Stack direction={{ md: 'row', xs: 'column' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h5">AI Work Assistant</Typography>
          <Typography color="text.secondary" variant="body2">
            Placeholder surface for future AI copilots and automated work summaries.
          </Typography>
        </div>
        <Chip label="Concept-ready" color="primary" />
      </Stack>

      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <SummaryCard
            title="Suggested Next Task"
            value={suggestedTask ? suggestedTask.priority : 'None'}
            caption={suggestedTask ? suggestedTask.title : 'No open tasks available.'}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <SummaryCard
            title="Blockers"
            value={blockedTasks.length}
            caption="Tasks currently blocked and waiting for intervention."
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <SummaryCard
            title="Release Readiness"
            value={releaseTasks.length === 0 ? 'Ready' : 'In Progress'}
            caption={`${releaseTasks.length} release items remain open.`}
          />
        </Grid>
      </Grid>

      <AIWorkAssistantCard projects={projects} tasks={tasks} />
    </Stack>
  );
}
