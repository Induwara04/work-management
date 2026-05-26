import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import {
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReactNode } from 'react';

import { AIWorkAssistantCard } from '../components/AIWorkAssistantCard';
import { EmptyState } from '../components/EmptyState';
import { PriorityChip } from '../components/PriorityChip';
import { StatusChip } from '../components/StatusChip';
import { SummaryCard } from '../components/SummaryCard';
import { useWorkManager } from '../hooks/useWorkManager';
import { Task } from '../types';
import { getCompletedTasksByWeek, getWorkloadSummary } from '../utils/analytics';
import { formatDateTime, isTaskDueToday, isTaskOverdue } from '../utils/date';

function TaskListCard({
  title,
  icon,
  tasks,
  getProjectTitle,
}: {
  title: string;
  icon: ReactNode;
  tasks: Task[];
  getProjectTitle: (projectId: string) => string;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Stack>

        {tasks.length === 0 ? (
          <EmptyState title="Nothing here" description="This section is clear right now." />
        ) : (
          <List disablePadding>
            {tasks.map((task) => (
              <ListItem key={task.id} disableGutters sx={{ alignItems: 'flex-start', py: 1.25 }}>
                <ListItemText
                  primary={task.title}
                  secondary={
                    <Stack spacing={0.75} sx={{ mt: 0.75 }}>
                      <Typography color="text.secondary" variant="body2">
                        {getProjectTitle(task.projectId)} • {formatDateTime(task.dueDate)}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <StatusChip status={task.status} />
                        <PriorityChip priority={task.priority} />
                      </Stack>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const theme = useTheme();
  const { tasks, projects, getProjectTitle } = useWorkManager();
  const workload = getWorkloadSummary(tasks);
  const chartData = getCompletedTasksByWeek(tasks);
  const todayTasks = tasks.filter((task) => isTaskDueToday(task));
  const overdueTasks = tasks.filter((task) => isTaskOverdue(task));
  const highPriorityTasks = tasks.filter(
    (task) => ['High', 'Critical'].includes(task.priority) && task.status !== 'Done',
  );
  const releaseWork = tasks.filter((task) => task.category === 'Release' || task.projectId === 'release-work');

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item lg={3} sm={6} xs={12}>
          <SummaryCard title="Open Tasks" value={workload.openTasks} caption="All tasks that still need attention." />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <SummaryCard title="Blocked" value={workload.blocked} caption="Items waiting on a decision or dependency." />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <SummaryCard title="High Priority" value={workload.highPriority} caption="High and critical work still open." />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <SummaryCard title="Due This Week" value={workload.dueThisWeek} caption="Tasks scheduled before the weekend." />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item lg={8} xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <div>
                  <Typography variant="h6">Weekly Productivity</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Completed tasks per week.
                  </Typography>
                </div>
                <Chip label="Recharts" variant="outlined" />
              </Stack>

              <ResponsiveContainer height={320} width="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary }} />
                  <YAxis
                    allowDecimals={false}
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.mode === 'dark' ? 'rgba(13, 27, 45, 0.92)' : 'rgba(255,255,255,0.94)',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      color: theme.palette.text.primary,
                    }}
                    cursor={{ fill: 'rgba(125, 211, 252, 0.08)' }}
                    labelStyle={{ color: theme.palette.text.primary }}
                  />
                  <Bar dataKey="completed" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item lg={4} xs={12}>
          <AIWorkAssistantCard projects={projects} tasks={tasks} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <TaskListCard
            title="Today's Tasks"
            icon={<TodayRoundedIcon color="primary" />}
            tasks={todayTasks}
            getProjectTitle={getProjectTitle}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          <TaskListCard
            title="Overdue Tasks"
            icon={<AssignmentLateRoundedIcon color="error" />}
            tasks={overdueTasks}
            getProjectTitle={getProjectTitle}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          <TaskListCard
            title="High-Priority Queue"
            icon={<FlagRoundedIcon color="warning" />}
            tasks={highPriorityTasks}
            getProjectTitle={getProjectTitle}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          <TaskListCard
            title="Upcoming Release Work"
            icon={<EventRoundedIcon color="secondary" />}
            tasks={releaseWork}
            getProjectTitle={getProjectTitle}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
