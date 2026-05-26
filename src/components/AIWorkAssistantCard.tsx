import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

import { Project, Task } from '../types';
import { getSuggestedNextTask } from '../utils/analytics';
import { isTaskOverdue } from '../utils/date';
import { getProjectName } from '../utils/tasks';

interface AIWorkAssistantCardProps {
  tasks: Task[];
  projects: Project[];
}

export function AIWorkAssistantCard({ tasks, projects }: AIWorkAssistantCardProps) {
  const suggestedTask = getSuggestedNextTask(tasks);
  const blockedTasks = tasks.filter((task) => task.status === 'Blocked');
  const overdueTasks = tasks.filter(isTaskOverdue);
  const releaseTasks = tasks.filter((task) => task.category === 'Release' && task.status !== 'Done');

  return (
    <Card
      sx={{
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(211,176,122,0.12), rgba(20,21,25,0.88))'
            : 'linear-gradient(180deg, rgba(155,115,65,0.09), rgba(255,255,255,0.74))',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <div>
            <Typography variant="h6">AI Work Assistant</Typography>
            <Typography color="text.secondary" variant="body2">
              Placeholder insights wired to your live task data.
            </Typography>
          </div>
          <Chip icon={<AutoAwesomeRoundedIcon />} label="AI-ready" color="primary" />
        </Stack>

        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleOutlineRoundedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1">Suggested next task</Typography>
              </Stack>
              <Typography variant="body1">
                {suggestedTask ? suggestedTask.title : 'No active work detected.'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {suggestedTask
                  ? `${getProjectName(projects, suggestedTask.projectId)} • ${suggestedTask.priority} priority`
                  : 'Complete or create a task to get a suggestion.'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item md={6} xs={12}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SummarizeOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1">Daily work summary</Typography>
              </Stack>
              <Typography variant="body2">
                {tasks.filter((task) => task.status !== 'Done').length} open tasks, {overdueTasks.length} overdue,
                and {releaseTasks.length} release items still active.
              </Typography>
            </Stack>
          </Grid>

          <Grid item md={6} xs={12}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReportProblemOutlinedIcon color="error" fontSize="small" />
                <Typography variant="subtitle1">Blocker summary</Typography>
              </Stack>
              <Typography variant="body2">
                {blockedTasks.length > 0
                  ? blockedTasks.map((task) => task.title).join(', ')
                  : 'No blocked tasks right now.'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item md={6} xs={12}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleOutlineRoundedIcon color="success" fontSize="small" />
                <Typography variant="subtitle1">Release readiness checklist</Typography>
              </Stack>
              <Typography variant="body2">
                {releaseTasks.length === 0
                  ? 'No outstanding release work.'
                  : 'Validate release notes, blocker ownership, QA status, and deployment window.'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
