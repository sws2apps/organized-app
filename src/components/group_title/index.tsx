import { Box } from '@mui/material';
import Typography from '@components/typography';
import { GroupTitleProps } from '@components/group_title/index.types';

/** A group headline with a decorative marker from the shared group palette. */
const GroupTitle = ({ label, color = 'accent-main' }: GroupTitleProps) => (
  <Typography
    component="h4"
    className="h3"
    sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}
  >
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '1lh',
        flexShrink: 0,
      }}
    >
      <Box
        component="span"
        sx={{
          width: '8px',
          height: '8px',
          borderRadius: 'var(--radius-max)',
          backgroundColor: `var(--${color})`,
        }}
      />
    </Box>
    <Box component="span" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {label}
    </Box>
  </Typography>
);

export default GroupTitle;
