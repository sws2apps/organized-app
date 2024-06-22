import { Box } from '@mui/material';
import { MeetingSectionType } from './index.types';
import Typography from '@components/typography';

const MeetingSection = ({ color, icon, part }: MeetingSectionType) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        borderRadius: 'var(--radius-s)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      {icon}
      <Typography className="h2-caps" color="var(--always-white)">
        {part}
      </Typography>
    </Box>
  );
};

export default MeetingSection;
