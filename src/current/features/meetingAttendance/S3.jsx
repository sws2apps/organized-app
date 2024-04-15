import Box from '@mui/material/Box';
import MeetingType from './MeetingType';

const S3 = ({ serviceYear, month }) => {
  return (
    <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <MeetingType type={'midweek'} serviceYear={serviceYear} month={month} />
      <MeetingType type={'weekend'} serviceYear={serviceYear} month={month} />
    </Box>
  );
};

export default S3;
