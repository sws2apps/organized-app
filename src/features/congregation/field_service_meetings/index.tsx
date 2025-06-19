import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import FieldServiceMeetingsList from './field_service_meetings_list';
import MeetingFormFields from './meeting_form/form_fields';
import Typography from '@components/typography';
import InfoTip from '@components/info_tip';
import { IconInfo } from '@components/icons';

/**
 * Field Service Meetings feature container component
 * Displays lists of midweek and weekend field service meetings
 */
const FieldServiceMeetingsContainer = () => {
  const { t } = useAppTranslation();

  const {
    midweekMeetings,
    weekendMeetings,
    isCreating,
    canManageMeetings,
    handleEditMeeting,
    handleCancelEdit,
    handleSaveMeeting,
    handleDeleteMeeting,
    editingMeeting,
  } = useFieldServiceMeetings(t);

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
            canEdit={canManageMeetings}
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
            canEdit={canManageMeetings}
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
