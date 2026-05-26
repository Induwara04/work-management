import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { Chip } from '@mui/material';

import { TaskPriority } from '../types';

const priorityColorMap: Record<TaskPriority, 'default' | 'success' | 'warning' | 'error'> = {
  Low: 'default',
  Medium: 'success',
  High: 'warning',
  Critical: 'error',
};

export function PriorityChip({ priority }: { priority: TaskPriority }) {
  return <Chip icon={<FlagRoundedIcon />} label={priority} color={priorityColorMap[priority]} size="small" />;
}

