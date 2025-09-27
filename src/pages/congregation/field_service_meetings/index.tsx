import { useState, MouseEvent } from 'react';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import { Box } from '@mui/material';
import {
  IconAdd,
  IconDate,
  IconEventAvailable,
  IconNavigateLeft,
  IconNavigateRight,
  IconPrint,
} from '@components/icons';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import ButtonGroup from '@components/button_group';
import Typography from '@components/typography';
import FilterChip from '@components/filter_chip';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import FieldServiceMeetingsList from '@features/congregation/field_service_meetings/field_service_meetings_list';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import FieldServiceMeetingForm from '@features/congregation/field_service_meetings/field_service_meeting_form';
import { StyledNavigationArrowButton } from '@features/meetings/midweek_editor/index.styles';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import SchedulePublish from '@features/congregation/field_service_meetings/schedule_publish';

const filters = [
  { id: 1, name: 'All' },
  { id: 2, name: 'My group' },
  { id: 3, name: 'Joint' },
  { id: 4, name: 'Zoom' },
];

const MeetingAttendance = () => {
  const { t } = useAppTranslation();
  const { isSecretary, isGroup } = useCurrentUser();
  const {
    meetings,
    addMeetingBoxShow,
    handleAddMeetingButtonClick,
    handleHideAddMeetingBox,
  } = useFieldServiceMeetings();
  const [filterId, setFilterId] = useState('All');
  const [openExport, setOpenExport] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const isConnected = true; // TODO: replace with actual connection status
  const handleClosePublish = () => setOpenPublish(false);
  const handleOpenPublish = () => setOpenPublish(true);

  function openScheduleExport(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    setOpenExport(true);
  }

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={
          !isGroup &&
          isSecretary && (
            <>
              {openExport && (
                <ScheduleExport
                  open={openExport}
                  onClose={() => setOpenExport(false)}
                />
              )}
              {isConnected && openPublish && (
                <SchedulePublish
                  type="midweek"
                  open={openPublish}
                  onClose={handleClosePublish}
                />
              )}
              <Button
                variant="secondary"
                onClick={openScheduleExport}
                startIcon={<IconPrint />}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                onClick={handleAddMeetingButtonClick}
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
          )
        }
      />
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: 'column',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px',
          backgroundColor: 'var(--white)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <StyledNavigationArrowButton>
              <IconNavigateLeft />
            </StyledNavigationArrowButton>
            <Box display="flex" alignItems="center">
              <Typography className="h2" sx={{ textAlign: 'center' }}>
                {new Date().toLocaleDateString(navigator.language, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              <IconDate sx={{ marginLeft: '16px' }} />
            </Box>
            <StyledNavigationArrowButton>
              <IconNavigateRight />
            </StyledNavigationArrowButton>
          </Box>
          <Box>
            <ButtonGroup
              buttons={[
                {
                  className: 'active',
                  variant: 'outlined',
                  children: t('tr_week'),
                  onClick: () => {},
                },
                {
                  variant: 'outlined',
                  children: t('tr_month'),
                  onClick: () => {},
                },
              ]}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.name}
              selected={filter.name === filterId}
              onClick={() => setFilterId(filter.name)}
            />
          ))}
        </Box>
      </Box>
      {addMeetingBoxShow && (
        <FieldServiceMeetingForm
          mode="add"
          handleCloseForm={handleHideAddMeetingBox}
        />
      )}
      <Typography
        className="h4"
        color="var(--accent-400)"
        sx={{ marginTop: '8px' }}
      >
        {t('tr_fieldServiceMeetings')}
      </Typography>
      <FieldServiceMeetingsList
        meetings={meetings
          .filter(
            (item) => item.meeting_data.type === filterId || filterId === 'All'
          )
          .map(fieldServiceMeetingData)}
        isAdding={addMeetingBoxShow}
      />
    </Box>
  );
};

export default MeetingAttendance;
