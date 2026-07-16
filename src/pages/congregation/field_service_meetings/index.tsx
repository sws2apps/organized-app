import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconPrint } from '@components/icons';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import FieldServiceMeetingsContainer from '@features/congregation/field_service_meetings';
import MeetingForm from '@features/congregation/field_service_meetings/meeting_form';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import QuickSettingsFieldServiceMeetings from '@features/congregation/field_service_meetings/quick_settings';
import useFieldServiceMeetingsFeature from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import CalendarNavigation from '@features/congregation/field_service_meetings/calendar_navigation';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';

const FieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  // Page-level UI state (dialogs, permissions).
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

  // Feature-level business logic (shared with the container below).
  const {
    isCreating,
    editingMeeting,
    handleSaveMeeting,
    handleCancelEdit,
    handleStartCreate,
  } = useFieldServiceMeetingsFeature();

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
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      {/* Communicates title + buttons to the fixed NavBar via Jotai atom */}
      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={actionButtons}
        quickSettings={canManageMeetings ? handleOpenQuickSettings : undefined}
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
        <MeetingForm
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
