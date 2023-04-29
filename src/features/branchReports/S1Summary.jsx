import Paper from '@mui/material/Paper';
import S1Field from './S1Field';

const S1Summary = ({ activePublishers, weekendMeetingAttendanceAvg }) => {
  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
      <S1Field field="activePublishers" value={activePublishers} />
      <S1Field field="weekendMeetingAttendanceAvg" value={weekendMeetingAttendanceAvg} />
    </Paper>
  );
};

export default S1Summary;
