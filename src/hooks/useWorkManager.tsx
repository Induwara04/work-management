import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';

import { useBrowserNotifications } from './useBrowserNotifications';
import { useNotes } from './useNotes';
import { useNotifications } from './useNotifications';
import { useProjects } from './useProjects';
import { useTasks } from './useTasks';
import { Note, NoteInput, Task, TaskFormValues, TaskMutationInput, TaskStatus } from '../types';
import { getSuggestedNextTask } from '../utils/analytics';
import { fromDateTimeInputValue } from '../utils/date';
import { buildTaskNotifications, getProjectName } from '../utils/tasks';

interface WorkManagerContextValue {
  loading: boolean;
  error: string | null;
  tasks: Task[];
  projects: ReturnType<typeof useProjects>['projects'];
  notifications: ReturnType<typeof useNotifications>['notifications'];
  notes: Note[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  taskDialogOpen: boolean;
  editingTask: Task | null;
  openNewTaskDialog: () => void;
  openEditTaskDialog: (task: Task) => void;
  closeTaskDialog: () => void;
  saveTask: (values: TaskFormValues) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  notificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  browserNotificationSupported: boolean;
  browserNotificationPermission: NotificationPermission | 'unsupported';
  requestBrowserNotificationPermission: () => Promise<void>;
  createNote: (input: NoteInput) => Promise<void>;
  updateNote: (noteId: string, input: NoteInput) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  suggestedTask: Task | undefined;
  getProjectTitle: (projectId: string) => string;
}

const WorkManagerContext = createContext<WorkManagerContextValue | undefined>(undefined);

function toTaskMutationInput(values: TaskFormValues): TaskMutationInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    category: values.category,
    dueDate: fromDateTimeInputValue(values.dueDate),
    projectId: values.projectId,
    tags: values.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

export function WorkManagerProvider({ children }: PropsWithChildren) {
  const { enqueueSnackbar } = useSnackbar();
  const projectsState = useProjects();
  const tasksState = useTasks();
  const notificationsState = useNotifications();
  const notesState = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  const generatedNotifications = useMemo(
    () => buildTaskNotifications(tasksState.tasks),
    [tasksState.tasks],
  );

  useEffect(() => {
    void notificationsState.syncTaskNotifications(generatedNotifications);
  }, [generatedNotifications, notificationsState.syncTaskNotifications]);

  const browserNotifications = useBrowserNotifications(notificationsState.notifications);

  const saveTask = async (values: TaskFormValues) => {
    const input = toTaskMutationInput(values);

    if (!input.title) {
      enqueueSnackbar('Task title is required.', { variant: 'warning' });
      return;
    }

    if (editingTask) {
      await tasksState.updateTask(editingTask.id, input);
      enqueueSnackbar('Task updated.', { variant: 'success' });
    } else {
      await tasksState.createTask(input);
      enqueueSnackbar('Task created.', { variant: 'success' });
    }

    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const deleteTask = async (taskId: string) => {
    await tasksState.deleteTask(taskId);
    enqueueSnackbar('Task deleted.', { variant: 'info' });
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const currentTask = tasksState.tasks.find((task) => task.id === taskId);
    if (!currentTask) {
      return;
    }

    await tasksState.updateTask(taskId, {
      title: currentTask.title,
      description: currentTask.description,
      status,
      priority: currentTask.priority,
      category: currentTask.category,
      dueDate: currentTask.dueDate,
      projectId: currentTask.projectId,
      tags: currentTask.tags,
    });
    enqueueSnackbar(`Task moved to ${status}.`, { variant: 'success' });
  };

  const createNote = async (input: NoteInput) => {
    await notesState.createNote(input);
    enqueueSnackbar('Note saved.', { variant: 'success' });
  };

  const updateNote = async (noteId: string, input: NoteInput) => {
    await notesState.updateNote(noteId, input);
    enqueueSnackbar('Note updated.', { variant: 'success' });
  };

  const deleteNote = async (noteId: string) => {
    await notesState.deleteNote(noteId);
    enqueueSnackbar('Note deleted.', { variant: 'info' });
  };

  const value: WorkManagerContextValue = {
    loading: projectsState.loading || tasksState.loading || notificationsState.loading || notesState.loading,
    error: projectsState.error ?? tasksState.error ?? notificationsState.error ?? notesState.error,
    tasks: tasksState.tasks,
    projects: projectsState.projects,
    notifications: notificationsState.notifications,
    notes: notesState.notes,
    searchTerm,
    setSearchTerm,
    taskDialogOpen,
    editingTask,
    openNewTaskDialog: () => {
      setEditingTask(null);
      setTaskDialogOpen(true);
    },
    openEditTaskDialog: (task) => {
      setEditingTask(task);
      setTaskDialogOpen(true);
    },
    closeTaskDialog: () => {
      setEditingTask(null);
      setTaskDialogOpen(false);
    },
    saveTask,
    deleteTask,
    updateTaskStatus,
    notificationCenterOpen,
    openNotificationCenter: () => setNotificationCenterOpen(true),
    closeNotificationCenter: () => setNotificationCenterOpen(false),
    markNotificationAsRead: notificationsState.markAsRead,
    markAllNotificationsRead: notificationsState.markAllAsRead,
    browserNotificationSupported: browserNotifications.supported,
    browserNotificationPermission: browserNotifications.permission,
    requestBrowserNotificationPermission: browserNotifications.requestPermission,
    createNote,
    updateNote,
    deleteNote,
    suggestedTask: getSuggestedNextTask(tasksState.tasks),
    getProjectTitle: (projectId: string) => getProjectName(projectsState.projects, projectId),
  };

  return <WorkManagerContext.Provider value={value}>{children}</WorkManagerContext.Provider>;
}

export function useWorkManager() {
  const context = useContext(WorkManagerContext);
  if (!context) {
    throw new Error('useWorkManager must be used within WorkManagerProvider');
  }

  return context;
}
