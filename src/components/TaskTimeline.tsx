import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

import { Project, Task } from '../types';
import { formatDateTime, isTaskDueToday, isTaskOverdue } from '../utils/date';
import { groupTasksByDate } from '../utils/tasks';
import { PriorityChip } from './PriorityChip';
import { StatusChip } from './StatusChip';

interface TaskTimelineProps {
  tasks: Task[];
  projects: Project[];
}

export function TaskTimeline({ tasks, projects }: TaskTimelineProps) {
  const groups = groupTasksByDate(tasks, projects);

  return (
    <Stack spacing={2.5}>
      {groups.map((group) => (
        <Card key={group.key}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">{group.label}</Typography>
              <Chip icon={<TodayRoundedIcon />} label={`${group.tasks.length} task${group.tasks.length === 1 ? '' : 's'}`} />
            </Stack>

            <Grid container spacing={2}>
              {group.tasks.map((task) => (
                <Grid item key={task.id} lg={4} md={6} xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderColor: isTaskOverdue(task)
                        ? 'error.main'
                        : isTaskDueToday(task)
                          ? 'warning.main'
                          : 'divider',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Typography variant="subtitle1">{task.title}</Typography>
                          {isTaskOverdue(task) ? (
                            <WarningAmberRoundedIcon color="error" fontSize="small" />
                          ) : null}
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                          {task.description || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                          <StatusChip status={task.status} />
                          <PriorityChip priority={task.priority} />
                          <Chip label={task.projectName} size="small" variant="outlined" />
                        </Stack>
                        <Typography color="text.secondary" variant="caption">
                          {formatDateTime(task.dueDate)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

