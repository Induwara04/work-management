import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfWeek,
  subWeeks,
} from 'date-fns';

import { Task } from '../types';

export function getCompletedTasksByWeek(tasks: Task[], weeks = 6) {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = subWeeks(currentWeekStart, weeks - index - 1);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const completed = tasks.filter((task) => {
      if (!task.completedAt) {
        return false;
      }

      const completedDate = parseISO(task.completedAt);
      return completedDate >= weekStart && completedDate <= weekEnd;
    }).length;

    return {
      name: format(weekStart, 'MMM d'),
      completed,
    };
  });
}

export function getStatusDistribution(tasks: Task[]) {
  const counts = new Map<string, number>();
  tasks.forEach((task) => {
    counts.set(task.status, (counts.get(task.status) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function getDailyProgress(tasks: Task[], days = 7) {
  const interval = eachDayOfInterval({
    start: startOfDay(addDays(new Date(), -days + 1)),
    end: endOfDay(new Date()),
  });

  return interval.map((day) => {
    const completed = tasks.filter((task) => task.completedAt && isSameDay(parseISO(task.completedAt), day)).length;
    const created = tasks.filter((task) => isSameDay(parseISO(task.createdAt), day)).length;

    return {
      name: format(day, 'EEE'),
      completed,
      created,
    };
  });
}

export function getWorkloadSummary(tasks: Task[]) {
  const openTasks = tasks.filter((task) => task.status !== 'Done').length;
  const blocked = tasks.filter((task) => task.status === 'Blocked').length;
  const highPriority = tasks.filter((task) => ['High', 'Critical'].includes(task.priority) && task.status !== 'Done').length;
  const dueThisWeek = tasks.filter((task) => {
    if (!task.dueDate || task.status === 'Done') {
      return false;
    }

    const due = parseISO(task.dueDate);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return due >= weekStart && due <= weekEnd;
  }).length;

  return {
    openTasks,
    blocked,
    highPriority,
    dueThisWeek,
  };
}

export function getSuggestedNextTask(tasks: Task[]) {
  return [...tasks]
    .filter((task) => task.status !== 'Done')
    .sort((left, right) => {
      const leftWeight = left.priority === 'Critical' ? 4 : left.priority === 'High' ? 3 : left.priority === 'Medium' ? 2 : 1;
      const rightWeight = right.priority === 'Critical' ? 4 : right.priority === 'High' ? 3 : right.priority === 'Medium' ? 2 : 1;
      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }

      if (!left.dueDate && !right.dueDate) {
        return 0;
      }
      if (!left.dueDate) {
        return 1;
      }
      if (!right.dueDate) {
        return -1;
      }

      return parseISO(left.dueDate).getTime() - parseISO(right.dueDate).getTime();
    })[0];
}

