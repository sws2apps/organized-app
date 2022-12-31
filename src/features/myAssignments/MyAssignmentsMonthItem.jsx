import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MyAssignmentsMonthItem = ({ assignment }) => {
  const { weekOf, assignmentContent, assignmentName, assignmentSource } = assignment;

  const dateValue = weekOf.split('/')[1];

  return (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <Paper sx={{ backgroundColor: '#3f51b5', padding: '0 20px' }} elevation={3}>
        <Typography align="center" sx={{ fontWeight: 'bold', fontSize: '22px', color: 'white' }}>
          {dateValue}
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography variant="h6" sx={{ lineHeight: 1.2, marginTop: '3px' }}>
          {assignmentName}
        </Typography>
        <Typography sx={{ lineHeight: 1.2 }}>{assignmentSource}</Typography>
        {assignmentContent && assignmentContent !== '' && (
          <Typography sx={{ lineHeight: 1.2, fontSize: '14px' }}>{assignmentContent}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MyAssignmentsMonthItem;
