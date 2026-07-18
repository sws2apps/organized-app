import { Box } from '@mui/material';
import CongregationInfo from './congregation_info';

const GeneralInformation = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <CongregationInfo />
    </Box>
  );
};

export default GeneralInformation;
