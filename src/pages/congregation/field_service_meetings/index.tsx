import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconPrint } from '@components/icons';
import useFieldServiceMeetings from '@pages/congregation/field_service_meetings/useFieldServiceMeetings';
import FieldServiceMeetingsContainer from '@features/congregation/field_service_meetings';
import MeetingForm from '@features/congregation/field_service_meetings/meeting_form';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import QuickSettingsFieldServiceMeetings from '@features/congregation/field_service_meetings/quick_settings';
import useFieldServiceMeetingsFeature from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import WeekSelector from '@features/congregation/field_service_meetings/week_selector';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import Card from '@components/card';
import CalendarNavigation from '@features/congregation/field_service_meetings/calendar_navigation';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';

const FieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const { desktopUp, laptopDown } = useBreakpoints();

  const {
    exportOpen,
    quickSettingsOpen,
    canExport,
    canManageMeetings,
    canOpenQuickSettings,
    handleOpenExport,
    handleCloseExport,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  } = useFieldServiceMeetings();

  const {
    isCreating,
    editingMeeting,
    handleSaveMeeting,
    handleCancelEdit,
    handleStartCreate,
    handleDeleteMeeting,
  } = useFieldServiceMeetingsFeature();

  const actionButtons =
    canExport || canManageMeetings ? (
      <NavBarButtonGroup>
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
            disabled={Boolean(editingMeeting)}
            icon={<IconAdd />}
            onClick={handleStartCreate}
          />
        )}
      </NavBarButtonGroup>
    ) : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: laptopDown ? '96px' : 0,
      }}
    >
      {/* Communicates title + buttons to the fixed NavBar via Jotai atom */}
      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={actionButtons}
        quickSettings={
          canOpenQuickSettings ? handleOpenQuickSettings : undefined
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <WeekSelector />
        <Card sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <CalendarNavigation />
          {editingMeeting && (
            <MeetingForm
              key={editingMeeting.meeting_uid}
              meeting={editingMeeting}
              mode={isCreating ? 'add' : 'edit'}
              onSave={handleSaveMeeting}
              onClose={handleCancelEdit}
              onDelete={isCreating ? undefined : handleDeleteMeeting}
            />
          )}
          <FieldServiceMeetingsContainer />
        </Card>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetings;
