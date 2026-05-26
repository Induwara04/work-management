export const TASK_STATUSES = ['Backlog', 'Todo', 'In Progress', 'Blocked', 'Done'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export const TASK_CATEGORIES = [
  'UI Issue',
  'Feature',
  'Bug Fix',
  'Release',
  'Meeting',
  'Research',
  'Personal',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type NotificationType = 'overdue' | 'due_today' | 'blocked' | 'system';
export type DueRange = 'all' | 'today' | 'week' | 'overdue' | 'upcoming';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  projectId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  taskId: string | null;
  dueDate: string | null;
  read: boolean;
  createdAt: string;
  sourceKey?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  linkedTaskId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  projectId: string;
  tags: string;
}

export interface TaskMutationInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  projectId: string;
  tags: string[];
}

export interface TaskFiltersState {
  status: 'All' | TaskStatus;
  priority: 'All' | TaskPriority;
  projectId: 'All' | string;
  dueRange: DueRange;
}

export interface NoteInput {
  title: string;
  content: string;
  linkedTaskId: string | null;
}

