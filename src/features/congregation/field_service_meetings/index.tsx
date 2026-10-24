import { Box } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetings from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import usePermissions from '@features/congregation/field_service_meetings/usePermissions';
import FieldServiceMeetingsList from '@features/congregation/field_service_meetings/field_service_meetings_list';
import MonthView from '@features/congregation/field_service_meetings/month_view';
import Typography from '@components/typography';
import PaneSwitcher from '@components/pane_switcher';
import InfoNote from '@components/info_note';
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
    handleEditMeeting,
    editingMeeting,
  } = useFieldServiceMeetings();
  const { canManageMeeting } = usePermissions();
  const [viewMode, setViewMode] = useAtom(fieldServiceMeetingsViewModeState);
  const setDate = useSetAtom(fieldServiceMeetingsWeekRangeState);
  const weekContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: 0,
      }}
    >
      {!editingMeeting &&
        midweekMeetings.length + weekendMeetings.length === 0 && (
          <InfoNote message={t('tr_fieldServiceMeetingEmptyFiltered')} />
        )}
      {[
        {
          label: 'tr_midweek',
          meetings: midweekMeetings.filter(
            (meeting) => meeting.uid !== editingMeeting?.meeting_uid
          ),
        },
        {
          label: 'tr_weekend',
          meetings: weekendMeetings.filter(
            (meeting) => meeting.uid !== editingMeeting?.meeting_uid
          ),
        },
      ].map(
        (section) =>
          section.meetings.length > 0 && (
            <Box
              key={section.label}
              sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <Typography className="h4">{t(section.label)}</Typography>
              <FieldServiceMeetingsList
                meetings={section.meetings}
                canEditMeeting={(meeting) =>
                  !editingMeeting &&
                  canManageMeeting(meeting.category, meeting.group_id)
                }
                onEditMeeting={handleEditMeeting}
              />
            </Box>
          )
      )}
    </Box>
  );
  return (
    <PaneSwitcher
      value={viewMode === 'week' ? 0 : 1}
      panes={[
        { key: 'week', content: weekContent },
        {
          key: 'month',
          content: (
            <MonthView
              meetings={monthMeetings}
              onSelectDay={(date) => {
                setDate(date);
                setViewMode('week');
              }}
            />
          ),
        },
      ]}
    />
  );
};
export default FieldServiceMeetingsContainer;
