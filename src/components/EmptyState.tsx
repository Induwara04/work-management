import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Button, Stack, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{
        minHeight: 220,
        borderRadius: '8px',
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        px: 3,
        textAlign: 'center',
      }}
    >
      <InboxOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
        {description}
      </Typography>
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </Stack>
  );
}
