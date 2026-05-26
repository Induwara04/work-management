import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

import { TASK_PRIORITIES, TASK_STATUSES, TaskFiltersState } from '../types';
import { Project } from '../types';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  projects: Project[];
  onChange: (filters: TaskFiltersState) => void;
}

export function TaskFilters({ filters, projects, onChange }: TaskFiltersProps) {
  return (
    <Grid container spacing={2}>
      <Grid item md={3} sm={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFiltersState['status'] })}
          >
            <MenuItem value="All">All</MenuItem>
            {TASK_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={3} sm={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFiltersState['priority'] })}
          >
            <MenuItem value="All">All</MenuItem>
            {TASK_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={3} sm={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Project</InputLabel>
          <Select
            label="Project"
            value={filters.projectId}
            onChange={(event) => onChange({ ...filters, projectId: event.target.value })}
          >
            <MenuItem value="All">All</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={3} sm={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Due Date</InputLabel>
          <Select
            label="Due Date"
            value={filters.dueRange}
            onChange={(event) => onChange({ ...filters, dueRange: event.target.value as TaskFiltersState['dueRange'] })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This week</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

