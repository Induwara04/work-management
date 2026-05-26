import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { TaskFilters } from '../components/TaskFilters';
import { TaskTable } from '../components/TaskTable';
import { useWorkManager } from '../hooks/useWorkManager';
import { TaskFiltersState, TaskStatus } from '../types';
import { filterTasks } from '../utils/tasks';

const defaultFilters: TaskFiltersState = {
  status: 'All',
  priority: 'All',
  projectId: 'All',
  dueRange: 'all',
};

export function TasksPage() {
  const {
    tasks,
    projects,
    searchTerm,
    openNewTaskDialog,
    openEditTaskDialog,
    deleteTask,
    updateTaskStatus,
  } = useWorkManager();
  const [filters, setFilters] = useState<TaskFiltersState>(defaultFilters);
  const [activeTab, setActiveTab] = useState<'All' | TaskStatus>('All');

  const filteredTasks = useMemo(() => {
    const nextFilters = { ...filters, status: activeTab };
    return filterTasks(tasks, searchTerm, nextFilters);
  }, [activeTab, filters, searchTerm, tasks]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ md: 'row', xs: 'column' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h5">Task Management</Typography>
          <Typography color="text.secondary" variant="body2">
            Create, filter, search, and update every unit of work from one table.
          </Typography>
        </div>
        <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={openNewTaskDialog}>
          New Task
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Tabs
              allowScrollButtonsMobile
              scrollButtons="auto"
              value={activeTab}
              variant="scrollable"
              onChange={(_, value) => setActiveTab(value)}
            >
              <Tab label="All" value="All" />
              <Tab label="Backlog" value="Backlog" />
              <Tab label="Todo" value="Todo" />
              <Tab label="In Progress" value="In Progress" />
              <Tab label="Blocked" value="Blocked" />
              <Tab label="Done" value="Done" />
            </Tabs>

            <TaskFilters filters={filters} projects={projects} onChange={setFilters} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1">{filteredTasks.length} tasks match the current filters.</Typography>

            {filteredTasks.length === 0 ? (
              <EmptyState
                title="No matching tasks"
                description="Adjust the filters or create a new task to populate this workspace."
                actionLabel="Create Task"
                onAction={openNewTaskDialog}
              />
            ) : (
              <TaskTable
                tasks={filteredTasks}
                projects={projects}
                onDelete={deleteTask}
                onEdit={openEditTaskDialog}
                onStatusChange={updateTaskStatus}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
