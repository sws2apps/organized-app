import { Box } from '@mui/material';
import useMinistryTimer from './useMinistryTimer';
import AddTimeDialog from './add_time_dialog';
import Duration from './duration';
import LeftButton from './left_button';
import ReportFormDialog from '../report_form_dialog';
import RightButton from './right_button';

const MinistryTimer = () => {
  const {
    timerState,
    handleRightButtonAction,
    handleLeftButtonAction,
    editorOpen,
    handleCloseEditor,
    sliderOpen,
    handleCloseSlider,
    handleOpenSlider,
    handleTimeAdded,
    time,
    report_date,
  } = useMinistryTimer();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '4px 8px 12px 8px',
        gap: '12px',
      }}
    >
      {editorOpen && (
        <ReportFormDialog
          open={editorOpen}
          onClose={handleCloseEditor}
          date={report_date}
        />
      )}

      {sliderOpen && (
        <AddTimeDialog
          open={sliderOpen}
          onClose={handleCloseSlider}
          onAdd={handleTimeAdded}
        />
      )}

      <LeftButton state={timerState} onClick={handleLeftButtonAction} />
      <Duration
        time={time}
        paused={timerState === 'paused'}
        started={timerState === 'started'}
        onClick={handleOpenSlider}
      />
      <RightButton state={timerState} onClick={handleRightButtonAction} />
    </Box>
  );
};

export default MinistryTimer;
