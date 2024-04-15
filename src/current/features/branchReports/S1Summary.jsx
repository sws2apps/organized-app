import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import S1Field from './S1Field';

const S1Summary = ({ activePublishers, weekendMeetingAttendanceAvg, gridViews }) => {
  return (
    <Grid item xs={gridViews.xs} sm={gridViews.sm} md={gridViews.md} lg={gridViews.lg}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', marginBottom: '15px' }}>
        <S1Field field="activePublishers" value={activePublishers} />
        <S1Field field="weekendMeetingAttendanceAvg" value={weekendMeetingAttendanceAvg} />
      </Paper>
    </Grid>
  );
};

export default S1Summary;
