import {
  format,
  formatDistanceToNowStrict,
  isPast,
  isToday,
  isTomorrow,
  parseISO,
  startOfDay,
} from 'date-fns';

import { Task } from '../types';

export function formatDateTime(value: string | null, fallback = 'No due date') {
  if (!value) {
    return fallback;
  }

  return format(parseISO(value), 'EEE, MMM d • p');
}

export function formatDateLabel(value: string | null) {
  if (!value) {
    return 'Unscheduled';
  }

  const parsed = parseISO(value);
  if (isToday(parsed)) {
    return `Today • ${format(parsed, 'p')}`;
  }
  if (isTomorrow(parsed)) {
    return `Tomorrow • ${format(parsed, 'p')}`;
  }

  return format(parsed, 'EEEE, MMM d');
}

export function toDateTimeInputValue(value: string | null) {
  if (!value) {
    return '';
  }

  const date = parseISO(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function fromDateTimeInputValue(value: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

export function isTaskDone(task: Task) {
  return task.status === 'Done';
}

export function isTaskOverdue(task: Task) {
  if (!task.dueDate || isTaskDone(task)) {
    return false;
  }

  return isPast(startOfDay(parseISO(task.dueDate)));
}

export function isTaskDueToday(task: Task) {
  if (!task.dueDate || isTaskDone(task)) {
    return false;
  }

  return isToday(parseISO(task.dueDate));
}

export function getRelativeDueText(task: Task) {
  if (!task.dueDate) {
    return 'No deadline';
  }

  return formatDistanceToNowStrict(parseISO(task.dueDate), { addSuffix: true });
}

