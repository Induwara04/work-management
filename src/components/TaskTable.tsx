import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Project, Task, TaskStatus } from '../types';
import { formatDateTime, getRelativeDueText } from '../utils/date';
import { PriorityChip } from './PriorityChip';
import { StatusChip } from './StatusChip';

interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

function getProjectName(projects: Project[], projectId: string) {
  return projects.find((project) => project.id === projectId)?.name ?? 'Unknown Project';
}

export function TaskTable({ tasks, projects, onEdit, onDelete, onStatusChange }: TaskTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => onEdit(task)}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => void onDelete(task.id)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {task.description || 'No description'}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <StatusChip status={task.status} />
                  <PriorityChip priority={task.priority} />
                  <Chip label={getProjectName(projects, task.projectId)} size="small" />
                  <Chip label={formatDateTime(task.dueDate)} size="small" />
                </Stack>
                <Typography color="text.secondary" variant="caption">
                  {getRelativeDueText(task)}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {(['Backlog', 'Todo', 'In Progress', 'Blocked', 'Done'] as TaskStatus[]).map((status) => (
                    <Chip
                      key={`${task.id}-${status}`}
                      clickable
                      color={task.status === status ? 'primary' : 'default'}
                      label={status}
                      size="small"
                      onClick={() => void onStatusChange(task.id, status)}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Due</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow hover key={task.id}>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography fontWeight={600}>{task.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {task.description || 'No description'}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <StatusChip status={task.status} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={task.priority} />
              </TableCell>
              <TableCell>{getProjectName(projects, task.projectId)}</TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="body2">{formatDateTime(task.dueDate)}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {getRelativeDueText(task)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                  {task.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                  <IconButton size="small" onClick={() => onEdit(task)}>
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => void onDelete(task.id)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

