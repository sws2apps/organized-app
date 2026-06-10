import { Box } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import useFieldServiceMeetingsPermissions from './usePermissions';
import FieldServiceMeetingsList from './field_service_meetings_list';
import MeetingFormFields from './meeting_form/form_fields';
import MonthView from './month_view';
import Typography from '@components/typography';
import InfoTip from '@components/info_tip';
import { IconInfo } from '@components/icons';
import {
  fieldServiceMeetingsViewModeState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';

/**
 * Field Service Meetings feature container component
 * Displays lists of midweek and weekend field service meetings
 */
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
  } = useFieldServiceMeetings(t);

  const { canManageMeeting } = useFieldServiceMeetingsPermissions();

  const viewMode = useAtomValue(fieldServiceMeetingsViewModeState);
  const setViewMode = useSetAtom(fieldServiceMeetingsViewModeState);
  const setWeekRange = useSetAtom(fieldServiceMeetingsWeekRangeState);

  // From the month grid, open a specific day in the week view.
  const handleSelectDay = (date: Date) => {
    setWeekRange(date);
    setViewMode('week');
  };

  const canEditMeeting = (meeting: { category: number; group_id?: string }) =>
    canManageMeeting(meeting.category, meeting.group_id);

  const hasNoMeetings =
    !isCreating && midweekMeetings.length === 0 && weekendMeetings.length === 0;

  const formComponent =
    editingMeeting && !isCreating ? (
      <MeetingFormFields
        meeting={editingMeeting}
        mode="edit"
        onSave={handleSaveMeeting}
        onClose={handleCancelEdit}
        onDelete={handleDeleteMeeting}
      />
    ) : undefined;

  if (viewMode === 'month') {
    return (
      <MonthView meetings={monthMeetings} onSelectDay={handleSelectDay} />
    );
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
            editingMeetingUid={
              editingMeeting && !isCreating
                ? editingMeeting.meeting_uid
                : undefined
            }
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
            editingMeetingUid={
              editingMeeting && !isCreating
                ? editingMeeting.meeting_uid
                : undefined
            }
            formComponent={formComponent}
          />
        </>
      )}
    </Box>
  );
};

export default FieldServiceMeetingsContainer;
