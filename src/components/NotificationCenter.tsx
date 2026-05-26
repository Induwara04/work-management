import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import {
  Badge,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { NotificationItem } from '../types';
import { formatDateTime } from '../utils/date';

interface NotificationCenterProps {
  open: boolean;
  notifications: NotificationItem[];
  permission: NotificationPermission | 'unsupported';
  supported: boolean;
  onClose: () => void;
  onEnableBrowserNotifications: () => Promise<void>;
  onMarkRead: (notificationId: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
}

export function NotificationCenter({
  open,
  notifications,
  permission,
  supported,
  onClose,
  onEnableBrowserNotifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Stack sx={{ width: 380, maxWidth: '100vw', p: 3 }} spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
            <Typography variant="h6">Notification Center</Typography>
          </Stack>
          <Button onClick={() => void onMarkAllRead()}>Mark all read</Button>
        </Stack>

        {supported && permission !== 'granted' ? (
          <Button
            startIcon={<NotificationsActiveRoundedIcon />}
            variant="contained"
            onClick={() => void onEnableBrowserNotifications()}
          >
            Enable browser alerts
          </Button>
        ) : null}

        <Divider />

        <List disablePadding>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              disableGutters
              secondaryAction={
                notification.read ? null : (
                  <IconButton edge="end" onClick={() => void onMarkRead(notification.id)}>
                    <NotificationsActiveRoundedIcon fontSize="small" />
                  </IconButton>
                )
              }
              sx={{
                alignItems: 'flex-start',
                borderRadius: '8px',
                mb: 1,
                px: 1.5,
                py: 1,
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ListItemText
                primary={notification.title}
                secondary={
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    <Typography color="text.secondary" variant="body2">
                      {notification.message}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {formatDateTime(notification.dueDate, 'System alert')}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Drawer>
  );
}
