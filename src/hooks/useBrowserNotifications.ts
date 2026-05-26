import { useCallback, useEffect, useRef, useState } from 'react';

import { NotificationItem } from '../types';

export function useBrowserNotifications(notifications: NotificationItem[]) {
  const shownNotifications = useRef(new Set<string>());
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    supported ? Notification.permission : 'unsupported',
  );

  const requestPermission = useCallback(async () => {
    if (!supported) {
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
  }, [supported]);

  useEffect(() => {
    if (!supported || permission !== 'granted') {
      return;
    }

    notifications
      .filter((notification) => !notification.read && ['overdue', 'due_today', 'blocked'].includes(notification.type))
      .forEach((notification) => {
        if (shownNotifications.current.has(notification.id)) {
          return;
        }

        new Notification(notification.title, {
          body: notification.message,
        });
        shownNotifications.current.add(notification.id);
      });
  }, [notifications, permission, supported]);

  return {
    supported,
    permission,
    requestPermission,
  };
}

