import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DutyNameProps } from './index.types';
import Typography from '@components/typography';

const DutyName = ({ icon, duty }: DutyNameProps) => {
  const { laptopDown } = useBreakpoints();

  return (
    <Box
      sx={{
        minWidth: 0,
        flexShrink: 0,
        borderRadius: 'var(--radius-l)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--accent-150)',
        width: '100%',
        // desktop matches the 48px field beside it
        minHeight: laptopDown ? '40px' : '44px',
        '& svg': { flexShrink: 0 },
      }}
    >
      {icon}
      <Typography
        className="body-small-semibold"
        sx={{ color: 'var(--accent-dark)', overflowWrap: 'anywhere' }}
      >
        {duty}
      </Typography>
    </Box>
  );
};

export default DutyName;
