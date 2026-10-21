import { Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ScheduleListType, SchedulePublishProps } from './index.types';
import useSchedulePublish from './useSchedulePublish';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import InfoNote from '@components/info_note';
import YearContainer from './year_container';

const selectedMonths = (schedules: ScheduleListType[]) =>
  schedules.reduce(
    (total, year) =>
      total + year.months.filter((month) => month.checked).length,
    0
  );

const publicationYears = (
  schedules: ScheduleListType[],
  reviewing: boolean
) => {
  if (!reviewing) return schedules;
  return schedules
    .map((schedule) => ({
      ...schedule,
      months: schedule.months.filter((month) => month.checked),
    }))
    .filter((schedule) => schedule.months.length > 0);
};

const SchedulePublish = (props: SchedulePublishProps) => {
  const { t } = useAppTranslation();
  const { tablet500Down } = useBreakpoints();

  const {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
    reviewing,
    setReviewing,
    selectedGaps,
    canPublish,
    publicationAvailable,
  } = useSchedulePublish(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t(reviewing ? 'tr_scheduleReviewTitle' : 'tr_publishSchedules')}
      description={
        reviewing
          ? t('tr_scheduleMonthsSelected', {
              count: selectedMonths(schedulesList),
            })
          : t('tr_scheduleChooseMonths')
      }
      actions={
        <DialogActions>
          <Button
            variant="secondary"
            disabled={isProcessing}
            onClick={reviewing ? () => setReviewing(false) : props.onClose}
          >
            {t(reviewing ? 'tr_back' : 'tr_cancel')}
          </Button>
          <Button
            variant="main"
            disabled={!canPublish}
            onClick={
              reviewing ? handlePublishSchedule : () => setReviewing(true)
            }
            endIcon={isProcessing ? <IconLoading /> : undefined}
          >
            {t(reviewing ? 'tr_publish' : 'tr_next')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="24px" sx={{ width: '100%' }}>
        {reviewing && <InfoNote message={t('tr_schedulePublishRetention')} />}
        {!publicationAvailable && (
          <InfoNote message={t('tr_scheduleStatusUnavailableDesc')} />
        )}
        {reviewing && (
          <InfoNote
            message={t('tr_scheduleReviewGaps', { count: selectedGaps })}
          />
        )}
        <Stack
          direction={tablet500Down ? 'column' : 'row'}
          spacing="24px"
          sx={{ width: '100%', alignItems: 'flex-start' }}
        >
          {publicationYears(schedulesList, reviewing).map((schedule) => (
            <YearContainer
              key={schedule.year}
              data={schedule}
              readOnly={reviewing}
              disabled={isProcessing}
              onChange={handleCheckedChange}
            />
          ))}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default SchedulePublish;
