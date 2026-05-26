import { Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { EmptyState } from '../components/EmptyState';
import { SummaryCard } from '../components/SummaryCard';
import { useWorkManager } from '../hooks/useWorkManager';
import { getCompletedTasksByWeek, getDailyProgress, getStatusDistribution } from '../utils/analytics';

const pieColors = ['#0f766e', '#2563eb', '#f59e0b', '#ef4444', '#14b8a6'];

export function AnalyticsPage() {
  const theme = useTheme();
  const { tasks } = useWorkManager();
  const completedByWeek = getCompletedTasksByWeek(tasks, 8);
  const statusDistribution = getStatusDistribution(tasks);
  const dailyProgress = getDailyProgress(tasks);
  const completionRate = tasks.length === 0 ? 0 : Math.round((tasks.filter((task) => task.status === 'Done').length / tasks.length) * 100);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h5">Analytics</Typography>
        <Typography color="text.secondary" variant="body2">
          Weekly throughput, status mix, and daily task progress.
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <SummaryCard title="Completion Rate" value={`${completionRate}%`} caption="Share of tasks marked done." />
        </Grid>
        <Grid item md={4} xs={12}>
          <SummaryCard
            title="Completed Tasks"
            value={tasks.filter((task) => task.status === 'Done').length}
            caption="All tasks completed across the dataset."
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <SummaryCard
            title="Active Items"
            value={tasks.filter((task) => task.status !== 'Done').length}
            caption="Tasks still in motion or awaiting action."
          />
        </Grid>
      </Grid>

      {tasks.length === 0 ? (
        <EmptyState title="No analytics yet" description="Add tasks and mark progress to populate charts." />
      ) : (
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <Card>
              <CardContent>
                <Typography sx={{ mb: 3 }} variant="h6">
                  Completed Tasks Per Week
                </Typography>
                <ResponsiveContainer height={320} width="100%">
                  <BarChart data={completedByWeek}>
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
                      labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={6} xs={12}>
            <Card>
              <CardContent>
                <Typography sx={{ mb: 3 }} variant="h6">
                  Task Status Distribution
                </Typography>
                <ResponsiveContainer height={320} width="100%">
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={statusDistribution}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: theme.palette.mode === 'dark' ? 'rgba(13, 27, 45, 0.92)' : 'rgba(255,255,255,0.94)',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        color: theme.palette.text.primary,
                      }}
                      labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography sx={{ mb: 3 }} variant="h6">
                  Daily Work Progress
                </Typography>
                <ResponsiveContainer height={320} width="100%">
                  <LineChart data={dailyProgress}>
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
                      labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Legend />
                    <Line dataKey="created" stroke={theme.palette.primary.main} strokeWidth={3} type="monotone" />
                    <Line dataKey="completed" stroke="#38bdf8" strokeWidth={3} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
