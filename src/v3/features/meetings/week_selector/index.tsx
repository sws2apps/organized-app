import { Box, Collapse } from '@mui/material';
import { IconAdd, IconClearMultiple, IconCollapse } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekSelector from './useWeekSelector';
import Button from '@components/button';
import Typography from '@components/typography';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { tabs, hasWeeks, expanded, handleToggleExpand, activeTab } = useWeekSelector();

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: desktopUp ? 'default' : 'pointer',
        }}
        onClick={desktopUp ? null : handleToggleExpand}
      >
        <Typography className="h2">{t('tr_meetingWeeks')}</Typography>
        {!desktopUp && (
          <IconCollapse
            color="var(--black)"
            sx={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}
          />
        )}
      </Box>

      <Collapse in={desktopUp || expanded} timeout="auto" unmountOnExit>
        {hasWeeks && <ScrollableTabs tabs={tabs} value={activeTab} />}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: hasWeeks ? 'space-between' : 'flex-end' }}>
          {hasWeeks && (
            <Button
              variant="small"
              startIcon={<IconClearMultiple height={20} width={20} />}
              sx={{ height: '32px', minHeight: '32px' }}
              color="red"
            >
              {t('tr_clear')}
            </Button>
          )}

          <Button
            variant="small"
            startIcon={<IconAdd height={20} width={20} />}
            sx={{ height: '32px', minHeight: '32px' }}
          >
            {t('tr_add')}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default WeekSelector;
