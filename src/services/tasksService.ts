import { supabase } from './supabase';
import { Task, TaskMutationInput } from '../types';

interface TaskRecord {
  id: string;
  title: string;
  description: string | null;
  status: Task['status'];
  priority: Task['priority'];
  category: Task['category'];
  due_date: string | null;
  project_id: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

const mapTaskRecord = (record: TaskRecord): Task => ({
  id: record.id,
  title: record.title,
  description: record.description ?? '',
  status: record.status,
  priority: record.priority,
  category: record.category,
  dueDate: record.due_date,
  projectId: record.project_id,
  tags: record.tags ?? [],
  createdAt: record.created_at,
  updatedAt: record.updated_at,
  completedAt: record.completed_at,
});

const toTaskRecord = (task: TaskMutationInput) => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  category: task.category,
  due_date: task.dueDate,
  project_id: task.projectId,
  tags: task.tags,
  completed_at: task.status === 'Done' ? new Date().toISOString() : null,
});

export async function listTasks() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTaskRecord);
}

export async function createTaskRecord(task: TaskMutationInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.from('tasks').insert(toTaskRecord(task)).select().single();
  if (error) {
    throw error;
  }

  return mapTaskRecord(data as TaskRecord);
}

export async function updateTaskRecord(taskId: string, task: TaskMutationInput) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...toTaskRecord(task),
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapTaskRecord(data as TaskRecord);
}

export async function deleteTaskRecord(taskId: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) {
    throw error;
  }
}

