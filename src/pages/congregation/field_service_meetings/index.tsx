import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import FieldServiceMeetingsContainer from '@features/congregation/field_service_meetings';
import MeetingFormFields from '@features/congregation/field_service_meetings/meeting_form/form_fields';
import PageTitle from '@components/page_title';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import SchedulePublish from '@features/congregation/field_service_meetings/schedule_publish';
import useFieldServiceMeetingsFeature from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import CalendarNavigation from '@features/congregation/field_service_meetings/calendar_navigation';
import Button from '@components/button';
import { IconAdd, IconEventAvailable, IconPrint } from '@components/icons';

/**
 * Field Service Meetings page component
 */
const FieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const isConnected = useAtomValue(congAccountConnectedState);

  // Page-level UI orchestration (state and handlers only)
  const {
    exportOpen,
    publishOpen,
    canManageMeetings,
    handleOpenExport,
    handleCloseExport,
    handleOpenPublish,
    handleClosePublish,
  } = useFieldServiceMeetings();

  // Feature-level business logic
  const {
    isCreating,
    editingMeeting,
    handleSaveMeeting,
    handleCancelEdit,
    handleStartCreate,
  } = useFieldServiceMeetingsFeature(t);

  const buttons = canManageMeetings ? (
    <>
      <Button
        variant="secondary"
        onClick={handleOpenExport}
        startIcon={<IconPrint />}
      >
        {t('tr_export')}
      </Button>
      <Button
        variant="secondary"
        onClick={handleStartCreate}
        startIcon={<IconAdd />}
      >
        {t('tr_add')}
      </Button>
      <Button
        variant="main"
        startIcon={<IconEventAvailable color="white" />}
        onClick={handleOpenPublish}
      >
        {t('tr_publish')}
      </Button>
    </>
  ) : undefined;

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {exportOpen && (
        <ScheduleExport open={exportOpen} onClose={handleCloseExport} />
      )}
      {isConnected && publishOpen && (
        <SchedulePublish
          type="midweek"
          open={publishOpen}
          onClose={handleClosePublish}
        />
      )}
      <PageTitle title={t('tr_fieldServiceMeetings')} buttons={buttons} />
      <CalendarNavigation />
      {editingMeeting && isCreating && (
        <MeetingFormFields
          meeting={editingMeeting}
          mode="add"
          onSave={handleSaveMeeting}
          onClose={handleCancelEdit}
        />
      )}
      <FieldServiceMeetingsContainer />
    </Box>
  );
};

export default FieldServiceMeetings;
