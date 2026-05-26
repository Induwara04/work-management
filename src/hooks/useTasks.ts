import { useCallback, useEffect, useState } from 'react';

import { createTaskRecord, deleteTaskRecord, listTasks, updateTaskRecord } from '../services/tasksService';
import { hasSupabaseConfig, supabaseConfigIssue } from '../services/supabase';
import { Task, TaskMutationInput } from '../types';
import { sortTasks } from '../utils/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      if (!hasSupabaseConfig) {
        if (active) {
          setError(supabaseConfigIssue ?? 'Supabase is not configured.');
          setTasks([]);
          setLoading(false);
        }
        return;
      }

      try {
        const nextTasks = await listTasks();
        if (active) {
          setTasks(sortTasks(nextTasks));
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load tasks');
          setTasks([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const createTask = useCallback(async (input: TaskMutationInput) => {
    const nextTask = await createTaskRecord(input);

    setTasks((currentTasks) => sortTasks([nextTask, ...currentTasks]));
    return nextTask;
  }, []);

  const updateTask = useCallback(async (taskId: string, input: TaskMutationInput) => {
    const nextTask = await updateTaskRecord(taskId, input);

    setTasks((currentTasks) =>
      sortTasks(currentTasks.map((task) => (task.id === taskId ? nextTask : task))),
    );
    return nextTask;
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await deleteTaskRecord(taskId);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
