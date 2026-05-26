import { supabase } from './supabase';
import { NotificationItem } from '../types';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: NotificationItem['type'];
  task_id: string | null;
  due_date: string | null;
  read: boolean;
  created_at: string;
  source_key: string | null;
}

const mapNotificationRecord = (record: NotificationRecord): NotificationItem => ({
  id: record.id,
  title: record.title,
  message: record.message,
  type: record.type,
  taskId: record.task_id,
  dueDate: record.due_date,
  read: record.read,
  createdAt: record.created_at,
  sourceKey: record.source_key ?? undefined,
});

export async function listNotifications() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapNotificationRecord);
}

export async function createNotificationRecord(notification: Omit<NotificationItem, 'id'>) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      task_id: notification.taskId,
      due_date: notification.dueDate,
      read: notification.read,
      source_key: notification.sourceKey ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapNotificationRecord(data as NotificationRecord);
}

export async function markNotificationReadRecord(notificationId: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  if (error) {
    throw error;
  }
}

