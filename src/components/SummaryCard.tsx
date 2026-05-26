import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  caption: string;
}

export function SummaryCard({ title, value, caption }: SummaryCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <div>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography sx={{ mt: 1 }} variant="h5">
              {value}
            </Typography>
          </div>
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'rgba(255,255,255,0.08)',
            }}
          >
            <TrendingUpRoundedIcon color="primary" fontSize="small" />
          </Box>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
          {caption}
        </Typography>
      </CardContent>
    </Card>
  );
}
