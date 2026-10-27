import { Box } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetings from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import usePermissions from '@features/congregation/field_service_meetings/usePermissions';
import FieldServiceMeetingsList from '@features/congregation/field_service_meetings/field_service_meetings_list';
import MonthView from '@features/congregation/field_service_meetings/month_view';
import PaneSwitcher from '@components/pane_switcher';
import InfoNote from '@components/info_note';
import {
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsViewModeState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';

const FieldServiceMeetingsContainer = () => {
  const { t } = useAppTranslation();
  const { weekMeetings, monthMeetings, handleEditMeeting, editingMeeting } =
    useFieldServiceMeetings();
  const { canManageMeeting } = usePermissions();
  const [viewMode, setViewMode] = useAtom(fieldServiceMeetingsViewModeState);
  const setDate = useSetAtom(fieldServiceMeetingsWeekRangeState);
  const filterId = useAtomValue(fieldServiceMeetingsFilterState);
  const weekContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: 0,
      }}
    >
      {!editingMeeting && weekMeetings.length === 0 && (
        <InfoNote
          message={t(
            filterId === 'all'
              ? 'tr_noFieldServiceMeetings'
              : 'tr_fieldServiceMeetingEmptyFiltered'
          )}
        />
      )}
      <FieldServiceMeetingsList
        meetings={weekMeetings.filter(
          (meeting) => meeting.uid !== editingMeeting?.meeting_uid
        )}
        canEditMeeting={(meeting) =>
          !editingMeeting &&
          canManageMeeting(meeting.category, meeting.group_id)
        }
        onEditMeeting={handleEditMeeting}
      />
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
