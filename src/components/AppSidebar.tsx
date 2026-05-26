import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const navigation = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/' },
  { label: 'Tasks', icon: <AssignmentTurnedInRoundedIcon />, path: '/tasks' },
  { label: 'Calendar', icon: <CalendarMonthRoundedIcon />, path: '/calendar' },
  { label: 'Analytics', icon: <InsightsRoundedIcon />, path: '/analytics' },
  { label: 'AI Work Assistant', icon: <AutoAwesomeRoundedIcon />, path: '/assistant' },
  { label: 'Notes', icon: <NotesRoundedIcon />, path: '/notes' },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent() {
  const location = useLocation();

  return (
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(255,255,255,0.08)',
            color: 'primary.main',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <WorkspacesRoundedIcon />
        </Box>
        <div>
          <Typography variant="h6">Work Manager</Typography>
          <Typography color="text.secondary" variant="body2">
            Single-user control center
          </Typography>
        </div>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ display: 'grid', gap: 0.5 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            selected={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
            to={item.path}
            sx={{
              borderRadius: '8px',
              '&.Mui-selected': {
                color: 'text.primary',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export function AppSidebar({ mobileOpen, onClose }: AppSidebarProps) {
  return (
    <>
      <Drawer
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        open
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}

export const APP_DRAWER_WIDTH = DRAWER_WIDTH;
