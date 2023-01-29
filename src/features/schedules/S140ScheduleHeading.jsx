import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const S140ScheduleHeading = ({ congName, congNumber, midweekMeetingPrint }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: '3px solid black',
        paddingBottom: '2px',
        marginBottom: '20px',
      }}
    >
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '13px',
          color: 'black',
        }}
      >
        {congName !== '' && congNumber !== '' ? `${congName.toUpperCase()} (${congNumber})` : ''}
      </Typography>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '19px',
          color: 'black',
        }}
      >
        {midweekMeetingPrint}
      </Typography>
    </Box>
  );
};

export default S140ScheduleHeading;
