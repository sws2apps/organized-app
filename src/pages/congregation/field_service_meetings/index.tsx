import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconPrint } from '@components/icons';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import FieldServiceMeetingsContainer from '@features/congregation/field_service_meetings';
import MeetingFormFields from '@features/congregation/field_service_meetings/meeting_form/form_fields';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import QuickSettingsFieldServiceMeetings from '@features/congregation/field_service_meetings/quick_settings';
import useFieldServiceMeetingsFeature from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import CalendarNavigation from '@features/congregation/field_service_meetings/calendar_navigation';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';

/**
 * Field Service Meetings page component.
 *
 * Uses the global PageTitle (null-rendering) to push the page title and action
 * buttons into the fixed NavBar AppBar header — matching the main-branch
 * pattern.  On desktop (≥ 688 px) the buttons are shown in the top bar; on
 * mobile they appear in the floating BottomMenu island.
 */
const FieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  // Page-level UI orchestration (state and handlers only)
  const {
    exportOpen,
    quickSettingsOpen,
    canExport,
    canManageMeetings,
    handleOpenExport,
    handleCloseExport,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  } = useFieldServiceMeetings();

  // Feature-level business logic
  const {
    isCreating,
    editingMeeting,
    handleSaveMeeting,
    handleCancelEdit,
    handleStartCreate,
  } = useFieldServiceMeetingsFeature(t);

  const actionButtons =
    canExport || canManageMeetings ? (
      <>
        {canExport && (
          <NavBarButton
            text={t('tr_export')}
            icon={<IconPrint />}
            onClick={handleOpenExport}
          />
        )}
        {canManageMeetings && (
          <NavBarButton
            main
            text={t('tr_add')}
            icon={<IconAdd />}
            onClick={handleStartCreate}
          />
        )}
      </>
    ) : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      {/* Communicates title + buttons to the fixed NavBar via Jotai atom */}
      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={actionButtons}
        quickSettings={
          canManageMeetings ? handleOpenQuickSettings : undefined
        }
      />

      {exportOpen && (
        <ScheduleExport open={exportOpen} onClose={handleCloseExport} />
      )}
      {quickSettingsOpen && (
        <QuickSettingsFieldServiceMeetings
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

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
