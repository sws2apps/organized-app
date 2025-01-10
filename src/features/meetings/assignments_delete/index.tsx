import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { AssignmentsDeleteType } from './index.types';
import useAssignmentsDelete from './useAssignmentsDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';
import WaitingLoader from '@components/waiting_loader';

const AssignmentsDelete = ({
  open,
  onClose,
  meeting,
}: AssignmentsDeleteType) => {
  const { t } = useAppTranslation();

  const {
    handleSetEndWeek,
    handleSetStartWeek,
    isProcessing,
    handleClearAssignments,
  } = useAssignmentsDelete(meeting, onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">
          {t('tr_clearMultipleAssignments')}
        </Typography>
        <Typography color="var(--grey-400)">
          {t('tr_clearMultipleDesc')}
        </Typography>
      </Box>

      <WeekRangeSelector
        meeting={meeting}
        onStartChange={handleSetStartWeek}
        onEndChange={handleSetEndWeek}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
          onClick={handleClearAssignments}
        >
          {t('tr_clearSelectedWeeks')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AssignmentsDelete;
