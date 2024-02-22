import { WeekendMeeting } from './views/index';
import { Box } from '@mui/material';
import { Typography } from '@components/index';

const PdfPreview = () => {
  return (
    <Box>
      <Typography>PDF</Typography>
      <WeekendMeeting />
    </Box>
  );
};

export default PdfPreview;
