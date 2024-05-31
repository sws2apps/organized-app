import { Box } from '@mui/material';
import { IconAdd, IconClearMultiple } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekSelector from './useWeekSelector';
import Button from '@components/button';
import Typography from '@components/typography';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { tabs } = useWeekSelector();

  return (
    <Box
      sx={{
        maxWidth: desktopUp ? '360px' : '100%',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-300)',
        backgroundColor: 'var(--white)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography className="h2">{t('tr_meetingWeeks')}</Typography>
      <ScrollableTabs tabs={tabs} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          variant="small"
          startIcon={<IconClearMultiple height={20} width={20} />}
          sx={{ height: '32px', minHeight: '32px' }}
          color="red"
        >
          {t('tr_clear')}
        </Button>
        <Button
          variant="small"
          startIcon={<IconAdd height={20} width={20} />}
          sx={{ height: '32px', minHeight: '32px' }}
        >
          {t('tr_add')}
        </Button>
      </Box>
    </Box>
  );
};

export default WeekSelector;
