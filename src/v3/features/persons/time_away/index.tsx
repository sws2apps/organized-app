import { Box } from '@mui/material';
import { IconAdd } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useTimeAway from './useTimeAway';
import TimeAwayItem from './components/time_away_item';

const PersonTimeAway = () => {
  const { t } = useAppTranslation();

  const {
    handleAddTimeAway,
    activeTimeAway,
    handleCommentsChange,
    handleDeleteTimeAway,
    handleEndDateChange,
    handleStartDateChange,
  } = useTimeAway();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Typography className="h2">{t('tr_timeAway')}</Typography>

      {activeTimeAway.length === 0 && (
        <Button
          variant="small"
          startIcon={<IconAdd />}
          onClick={handleAddTimeAway}
          sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
        >
          {t('tr_add')}
        </Button>
      )}

      {activeTimeAway.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          {activeTimeAway.map((timeAwayItem, index) => (
            <TimeAwayItem
              key={timeAwayItem.id}
              id={timeAwayItem.id}
              startDate={timeAwayItem.startDate.value}
              endDate={timeAwayItem.endDate.value}
              comments={timeAwayItem.comments.value}
              isLast={index === activeTimeAway.length - 1}
              onAdd={handleAddTimeAway}
              onCommentsChange={handleCommentsChange}
              onDelete={handleDeleteTimeAway}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PersonTimeAway;
