import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Typography from '@mui/material/Typography';
import MyAssignmentsMonthItem from './MyAssignmentsMonthItem';

const MyAssignmentsMonth = ({ monthData }) => {
  return (
    <Box sx={{ paddingBottom: '10px', borderBottom: '1px outset' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '5px',
          borderBottom: '1px outset',
          paddingBottom: '5px',
          marginBottom: '10px',
        }}
      >
        <CalendarMonthIcon color="primary" sx={{ fontSize: '50px' }} />
        <Typography variant="h5" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {monthData.month_value}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {monthData.month_assignments.map((assignment) => (
          <MyAssignmentsMonthItem key={`my-assignment-${assignment.ID}`} assignment={assignment} />
        ))}
      </Box>
    </Box>
  );
};

export default MyAssignmentsMonth;
