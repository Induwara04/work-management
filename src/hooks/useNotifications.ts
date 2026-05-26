import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createNotificationRecord,
  listNotifications,
  markNotificationReadRecord,
} from '../services/notificationsService';
import { hasSupabaseConfig, supabaseConfigIssue } from '../services/supabase';
import { NotificationItem } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notificationsRef = useRef<NotificationItem[]>([]);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      if (!hasSupabaseConfig) {
        if (active) {
          setError(supabaseConfigIssue ?? 'Supabase is not configured.');
          setNotifications([]);
          setLoading(false);
        }
        return;
      }

      try {
        const nextNotifications = await listNotifications();
        if (active) {
          setNotifications(nextNotifications);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load notifications');
          setNotifications([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const syncTaskNotifications = useCallback(async (generatedNotifications: Omit<NotificationItem, 'id'>[]) => {
    setNotifications((currentNotifications) => {
      const preserved = currentNotifications.filter(
        (notification) =>
          notification.type === 'system' ||
          (notification.sourceKey && !notification.sourceKey.startsWith('overdue-') &&
            !notification.sourceKey.startsWith('due-today-') &&
            !notification.sourceKey.startsWith('blocked-')),
      );

      const mergedGenerated = generatedNotifications.map((notification) => {
        const existing = currentNotifications.find((item) => item.sourceKey === notification.sourceKey);
        return existing ?? {
          ...notification,
          id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `notification-${Date.now()}-${notification.sourceKey}`,
        };
      });

      return [...mergedGenerated, ...preserved].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    });

    for (const notification of generatedNotifications) {
      const exists = notificationsRef.current.find((item) => item.sourceKey === notification.sourceKey);
      if (!exists) {
        await createNotificationRecord(notification);
      }
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationReadRecord(notificationId);
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((notification) => !notification.read);
    await Promise.all(unread.map((notification) => markAsRead(notification.id)));
  }, [markAsRead, notifications]);

  return {
    notifications,
    loading,
    error,
    syncTaskNotifications,
    markAsRead,
    markAllAsRead,
  };
}
