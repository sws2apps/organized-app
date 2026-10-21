import { CLEANING_NAME_WIDTH } from '@features/activities/hall_cleaning/row_layout';
import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { CleaningNameProps } from './index.types';
import Typography from '@components/typography';

const CleaningName = ({ icon, duty, sx }: CleaningNameProps) => {
  const { laptopDown } = useBreakpoints();

  return (
    <Box
      sx={{
        minWidth: CLEANING_NAME_WIDTH,
        borderRadius: 'var(--radius-l)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--accent-150)',
        width: laptopDown ? '100%' : CLEANING_NAME_WIDTH,
        // desktop matches the 44px person field beside it
        height: laptopDown ? '40px' : '44px',
        ...sx,
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

export default CleaningName;
