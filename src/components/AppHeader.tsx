import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

interface AppHeaderProps {
  mode: 'light' | 'dark';
  mobileMenuOpen: () => void;
  onToggleMode: () => void;
  onQuickAdd: () => void;
  onNotifications: () => void;
  notificationCount: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

export function AppHeader({
  mode,
  mobileMenuOpen,
  onToggleMode,
  onQuickAdd,
  onNotifications,
  notificationCount,
  searchTerm,
  onSearchTermChange,
}: AppHeaderProps) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 76 }}>
        <IconButton sx={{ display: { lg: 'none' } }} onClick={mobileMenuOpen}>
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Personal Work Management</Typography>
          <Typography color="text.secondary" variant="body2">
            Track work, releases, bugs, meetings, and reminders from one place.
          </Typography>
        </Box>

        <TextField
          placeholder="Search tasks, notes, or tags"
          size="small"
          sx={{ minWidth: { xs: 0, md: 320 }, width: { xs: '100%', md: 'auto' } }}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          <IconButton onClick={onToggleMode}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
          <IconButton onClick={onNotifications}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
          <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={onQuickAdd}>
            Quick Add
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
