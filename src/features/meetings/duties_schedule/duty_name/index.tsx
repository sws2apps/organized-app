import { Box } from '@mui/material';
import { DutyNameProps } from './index.types';
import Typography from '@components/typography';

const DutyName = ({ icon, duty }: DutyNameProps) => {
  return (
    <Box
      sx={{
        minWidth: '200px',
        borderRadius: 'var(--radius-l)',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--accent-150)',
      }}
    >
      {icon}
      <Typography className="body-small-semibold" color="var(--accent-dark)">
        {duty}
      </Typography>
    </Box>
  );
};

export default DutyName;
