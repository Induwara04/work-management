import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import { Chip } from '@mui/material';

import { TaskStatus } from '../types';

const statusColorMap: Record<TaskStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  Backlog: 'default',
  Todo: 'primary',
  'In Progress': 'warning',
  Blocked: 'error',
  Done: 'success',
};

export function StatusChip({ status }: { status: TaskStatus }) {
  return <Chip icon={<LinearScaleRoundedIcon />} label={status} color={statusColorMap[status]} size="small" />;
}

