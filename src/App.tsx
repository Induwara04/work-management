import '@fontsource/ibm-plex-sans';

import { CssBaseline, Box, CircularProgress, Stack, ThemeProvider } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { AppHeader } from './components/AppHeader';
import { APP_DRAWER_WIDTH, AppSidebar } from './components/AppSidebar';
import { NotificationCenter } from './components/NotificationCenter';
import { TaskDialog } from './components/TaskDialog';
import { WorkManagerProvider, useWorkManager } from './hooks/useWorkManager';
import { AssistantPage } from './pages/AssistantPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotesPage } from './pages/NotesPage';
import { TasksPage } from './pages/TasksPage';
import { buildAppTheme } from './theme/theme';

function AppLayout({
  mode,
  onToggleMode,
}: {
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}) {
  const {
    loading,
    error,
    notifications,
    projects,
    searchTerm,
    setSearchTerm,
    taskDialogOpen,
    editingTask,
    openNewTaskDialog,
    closeTaskDialog,
    saveTask,
    notificationCenterOpen,
    openNotificationCenter,
    closeNotificationCenter,
    markNotificationAsRead,
    markAllNotificationsRead,
    browserNotificationPermission,
    browserNotificationSupported,
    requestBrowserNotificationPermission,
  } = useWorkManager();
  const { enqueueSnackbar } = useSnackbar();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, ml: { lg: `${APP_DRAWER_WIDTH}px` } }}>
        <AppHeader
          mode={mode}
          mobileMenuOpen={() => setMobileOpen(true)}
          notificationCount={notifications.filter((notification) => !notification.read).length}
          onNotifications={openNotificationCenter}
          onQuickAdd={openNewTaskDialog}
          onSearchTermChange={setSearchTerm}
          onToggleMode={onToggleMode}
          searchTerm={searchTerm}
        />

        <Box sx={{ p: { md: 4, xs: 2 }, pb: 5 }}>
          <Outlet />
        </Box>
      </Box>

      <TaskDialog
        open={taskDialogOpen}
        task={editingTask}
        projects={projects}
        onClose={closeTaskDialog}
        onSave={saveTask}
      />

      <NotificationCenter
        open={notificationCenterOpen}
        notifications={notifications}
        permission={browserNotificationPermission}
        supported={browserNotificationSupported}
        onClose={closeNotificationCenter}
        onEnableBrowserNotifications={requestBrowserNotificationPermission}
        onMarkRead={markNotificationAsRead}
        onMarkAllRead={markAllNotificationsRead}
      />
    </Box>
  );
}

function AppContent() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => buildAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <WorkManagerProvider>
          <Routes>
            <Route
              element={<AppLayout mode={mode} onToggleMode={() => setMode((currentMode) => currentMode === 'light' ? 'dark' : 'light')} />}
              path="/"
            >
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="notes" element={<NotesPage />} />
            </Route>
          </Routes>
        </WorkManagerProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }} autoHideDuration={3500}>
      <AppContent />
    </SnackbarProvider>
  );
}
