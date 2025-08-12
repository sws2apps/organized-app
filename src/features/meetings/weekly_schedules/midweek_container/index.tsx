import { Box, Stack } from '@mui/material';
import useMidweekContainer from './useMidweekContainer';
import useSiblingAssignments from '../../sibling_assignments/useSiblingAssignments';
import MidweekMeeting from '../midweek_meeting';
import NoSchedule from '../no_schedule';
import SiblingAssignment from '../../sibling_assignments';
import WeekScheduleHeader from '../week_schedule_header';
import WeekSelector from '../week_selector';

const MidweekContainer = () => {
  const { views } = useSiblingAssignments();

  const {
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    dataView,
  } = useMidweekContainer();

  return (
    <>
      {noSchedule && <NoSchedule />}

      {!noSchedule && (
        <Box
          sx={{
            marginTop: '8px',
          }}
        >
          <WeekSelector value={value} onChange={handleValueChange} />

          <WeekScheduleHeader
            currentVisible={currentWeekVisible}
            week={week}
            onCurrent={handleGoCurrent}
            lastUpdated={scheduleLastUpdated}
          />

          {week && (
            <Stack spacing="24px">
              <MidweekMeeting week={week} dataView={dataView} />

              {views.map((view) => (
                <SiblingAssignment
                  key={view.type}
                  label={view.label}
                  type={view.type}
                >
                  <MidweekMeeting week={week} dataView={view.type} />
                </SiblingAssignment>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};

export default MidweekContainer;
