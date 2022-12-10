import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MyAssignmentsMonthItem = ({ assignment }) => {
  const { weekOf, assignmentName, assignmentSource } = assignment;

  const dateValue = weekOf.split('/')[1];

  return (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Paper sx={{ backgroundColor: '#3f51b5' }} elevation={3}>
        <Typography align="center" sx={{ padding: '20px', fontWeight: 'bold', fontSize: '22px', color: 'white' }}>
          {dateValue}
        </Typography>
      </Paper>
      <Box>
        <Typography variant="h6" sx={{ lineHeight: 1.2, marginBottom: '5px' }}>
          {assignmentName}
        </Typography>
        <Typography sx={{ lineHeight: 1.2 }}>{assignmentSource}</Typography>
      </Box>
    </Box>
  );
};

export default MyAssignmentsMonthItem;
