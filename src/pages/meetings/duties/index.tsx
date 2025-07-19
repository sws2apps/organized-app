import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import DutiesEditor from '@features/meetings/duties_schedule/duties_editor';
import PageTitle from '@components/page_title';
import WeekSelector from '@features/meetings/week_selector';

const MeetingDuties = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_meetingDutiesSchedules')} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <WeekSelector />
        <DutiesEditor />
      </Box>
    </Box>
  );
};

export default MeetingDuties;
