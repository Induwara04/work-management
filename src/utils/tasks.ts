import { compareAsc, endOfWeek, isWithinInterval, parseISO, startOfDay, startOfWeek } from 'date-fns';

import { NotificationItem, Project, Task, TaskFiltersState, TaskPriority } from '../types';
import { formatDateLabel, isTaskDueToday, isTaskOverdue } from './date';

const priorityRank: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((left, right) => {
    const leftPriority = priorityRank[right.priority] - priorityRank[left.priority];
    if (leftPriority !== 0) {
      return leftPriority;
    }

    if (!left.dueDate && !right.dueDate) {
      return compareAsc(parseISO(left.createdAt), parseISO(right.createdAt));
    }
    if (!left.dueDate) {
      return 1;
    }
    if (!right.dueDate) {
      return -1;
    }

    return compareAsc(parseISO(left.dueDate), parseISO(right.dueDate));
  });
}

export function filterTasks(tasks: Task[], searchTerm: string, filters: TaskFiltersState) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      `${task.title} ${task.description} ${task.tags.join(' ')}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus = filters.status === 'All' || task.status === filters.status;
    const matchesPriority = filters.priority === 'All' || task.priority === filters.priority;
    const matchesProject = filters.projectId === 'All' || task.projectId === filters.projectId;

    let matchesDueRange = true;
    if (filters.dueRange !== 'all') {
      if (!task.dueDate) {
        matchesDueRange = false;
      } else {
        const dueDate = parseISO(task.dueDate);
        const today = startOfDay(new Date());
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        if (filters.dueRange === 'today') {
          matchesDueRange = isTaskDueToday(task);
        }
        if (filters.dueRange === 'overdue') {
          matchesDueRange = isTaskOverdue(task);
        }
        if (filters.dueRange === 'week') {
          matchesDueRange = isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
        }
        if (filters.dueRange === 'upcoming') {
          matchesDueRange = dueDate >= today && !isTaskDueToday(task);
        }
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesDueRange;
  });
}

export function groupTasksByDate(tasks: Task[], projects: Project[]) {
  const projectMap = new Map(projects.map((project) => [project.id, project]));
  const grouped = new Map<string, { label: string; tasks: (Task & { projectName: string })[] }>();

  sortTasks(tasks).forEach((task) => {
    const key = task.dueDate ? startOfDay(parseISO(task.dueDate)).toISOString() : 'unscheduled';
    const label = formatDateLabel(task.dueDate);
    const current = grouped.get(key) ?? { label, tasks: [] };
    current.tasks.push({
      ...task,
      projectName: projectMap.get(task.projectId)?.name ?? 'Unknown Project',
    });
    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([key, value]) => ({
    key,
    ...value,
  }));
}

export function buildTaskNotifications(tasks: Task[]): Omit<NotificationItem, 'id'>[] {
  const now = new Date().toISOString();
  const notifications: Omit<NotificationItem, 'id'>[] = [];

  tasks.forEach((task) => {
    if (isTaskOverdue(task)) {
      notifications.push({
        title: 'Overdue task',
        message: `${task.title} is overdue.`,
        type: 'overdue',
        taskId: task.id,
        dueDate: task.dueDate,
        read: false,
        createdAt: now,
        sourceKey: `overdue-${task.id}`,
      });
    }

    if (isTaskDueToday(task)) {
      notifications.push({
        title: 'Due today',
        message: `${task.title} is due today.`,
        type: 'due_today',
        taskId: task.id,
        dueDate: task.dueDate,
        read: false,
        createdAt: now,
        sourceKey: `due-today-${task.id}`,
      });
    }

    if (task.status === 'Blocked') {
      notifications.push({
        title: 'Blocked task',
        message: `${task.title} is blocked and needs a decision.`,
        type: 'blocked',
        taskId: task.id,
        dueDate: task.dueDate,
        read: false,
        createdAt: now,
        sourceKey: `blocked-${task.id}`,
      });
    }
  });

  return notifications;
}

export function getProjectName(projects: Project[], projectId: string) {
  return projects.find((project) => project.id === projectId)?.name ?? 'Unknown Project';
}

