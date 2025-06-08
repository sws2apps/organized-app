import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DutyNameProps } from './index.types';
import Typography from '@components/typography';

const DutyName = ({ icon, duty }: DutyNameProps) => {
  const { laptopDown } = useBreakpoints();

  return (
    <Box
      sx={{
        minWidth: '240px',
        borderRadius: 'var(--radius-l)',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--accent-150)',
        width: laptopDown && '100%',
        height: '44px',
      }}
    >
      {icon}
      <Typography
        className="body-small-semibold"
        color="var(--accent-dark)"
        sx={{ textWrap: 'wrap' }}
      >
        {duty}
      </Typography>
    </Box>
  );
};

export default DutyName;
