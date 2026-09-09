import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeeklySchedules from './useWeeklySchedules';
import PageTitle from '@components/page_title';
import ScrollableTabs from '@components/scrollable_tabs';

const WeeklySchedules = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const { value, handleScheduleChange, tabs } = useWeeklySchedules();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle title={t('tr_meetingSchedules')} />

      <Box
        sx={{
          backgroundColor: 'var(--white)',
          padding: '15px',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
        }}
      >
        <ScrollableTabs
          indicatorMode
          tabs={tabs}
          value={value}
          onChange={handleScheduleChange}
          sx={{
            '& button.Mui-selected': {
              color: 'var(--accent-main)',
              background: 'unset',
              borderRadius: 'var(--radius-s)',
            },
            '& button.Mui-selected:hover': {
              background: 'var(--accent-150)',
              borderRadius: 'var(--radius-s)',
            },
            '& .MuiTab-root:not(.Mui-selected):hover': {
              background: 'var(--accent-150)',
              borderRadius: 'var(--radius-s)',
            },
            '& span.MuiTouchRipple-root': { borderRadius: 'var(--radius-s)' },
          }}
        />
      </Box>
    </Box>
  );
};

export default WeeklySchedules;
