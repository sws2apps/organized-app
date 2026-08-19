import { Box } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import useFieldServiceMeetingsPermissions from './usePermissions';
import FieldServiceMeetingsList from './field_service_meetings_list';
import MeetingForm from './meeting_form';
import MonthView from './month_view';
import Typography from '@components/typography';
import InfoTip from '@components/info_tip';
import { IconInfo } from '@components/icons';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import {
  fieldServiceMeetingsViewModeState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';

const FieldServiceMeetingsContainer = () => {
  const { t } = useAppTranslation();

  const {
    midweekMeetings,
    weekendMeetings,
    monthMeetings,
    isCreating,
    handleEditMeeting,
    handleCancelEdit,
    handleSaveMeeting,
    handleDeleteMeeting,
    editingMeeting,
  } = useFieldServiceMeetings();

  const { canManageMeeting } = useFieldServiceMeetingsPermissions();

  const [viewMode, setViewMode] = useAtom(fieldServiceMeetingsViewModeState);
  const setWeekRange = useSetAtom(fieldServiceMeetingsWeekRangeState);

  // From the month grid, open a specific day in the week view.
  const handleSelectDay = (date: Date) => {
    setWeekRange(date);
    setViewMode('week');
  };

  const canEditMeeting = (meeting: FieldServiceMeetingFormattedType) =>
    canManageMeeting(meeting.category, meeting.group_id);

  const hasNoMeetings =
    !isCreating && midweekMeetings.length === 0 && weekendMeetings.length === 0;

  const editingMeetingUid =
    editingMeeting && !isCreating ? editingMeeting.meeting_uid : undefined;

  const formComponent =
    editingMeeting && !isCreating ? (
      <MeetingForm
        meeting={editingMeeting}
        mode="edit"
        onSave={handleSaveMeeting}
        onClose={handleCancelEdit}
        onDelete={handleDeleteMeeting}
      />
    ) : undefined;

  if (viewMode === 'month') {
    return <MonthView meetings={monthMeetings} onSelectDay={handleSelectDay} />;
  }

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {hasNoMeetings && (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="blue"
          text={t('tr_noFieldServiceMeetings')}
        />
      )}

      {midweekMeetings.length > 0 && (
        <>
          <Typography
            className="h4"
            color="var(--accent-400)"
            sx={{ marginTop: '8px' }}
          >
            {t('tr_midweek')}
          </Typography>

          <FieldServiceMeetingsList
            meetings={midweekMeetings}
            canEditMeeting={canEditMeeting}
            onEditMeeting={handleEditMeeting}
            editingMeetingUid={editingMeetingUid}
            formComponent={formComponent}
          />
        </>
      )}

      {weekendMeetings.length > 0 && (
        <>
          <Typography
            className="h4"
            color="var(--accent-400)"
            sx={{ marginTop: '8px' }}
          >
            {t('tr_weekend')}
          </Typography>

          <FieldServiceMeetingsList
            meetings={weekendMeetings}
            canEditMeeting={canEditMeeting}
            onEditMeeting={handleEditMeeting}
            editingMeetingUid={editingMeetingUid}
            formComponent={formComponent}
          />
        </>
      )}
    </Box>
  );
};

export default FieldServiceMeetingsContainer;
