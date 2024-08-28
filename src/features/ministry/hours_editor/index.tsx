import { Box } from '@mui/material';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import TimeField from '@components/timefield';

const HoursEditor = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '168px',
      }}
    >
      <MinusButton />
      <TimeField />
      <PlusButton />
    </Box>
  );
};

export default HoursEditor;
