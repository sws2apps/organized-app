import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SchedulePublishProps } from './index.types';
import useSchedulePublish from './useSchedulePublish';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import Typography from '@components/typography';
import YearContainer from './year_container';
import WaitingLoader from '@components/waiting_loader';

const SchedulePublish = (props: SchedulePublishProps) => {
  const { t } = useAppTranslation();

  const {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
  } = useSchedulePublish(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_publishSchedules')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_publishSchedulesDesc')}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing="24px"
        divider={
          <Divider orientation="vertical" color="var(--accent-200)" flexItem />
        }
        sx={{ width: '100%', overflow: 'auto' }}
      >
        {schedulesList.map((schedule) => (
          <YearContainer
            key={schedule.year}
            data={schedule}
            onChange={handleCheckedChange}
          />
        ))}
      </Stack>

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
          onClick={handlePublishSchedule}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
        >
          {t('tr_publish')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SchedulePublish;
