import { Box } from '@mui/material';
import { IconAdd } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';
import { ProfileItemContainer } from '../my_profile.styles';
import { useAppTranslation } from '@hooks/index';
import useTimeAway from './useTimeAway';
import TimeAwayItem from './components/TimeAwayItem';

const UserTimeAway = () => {
  const { t } = useAppTranslation();

  const { timeAwayList, handleAddTimeAway, handleDeleteTimeAway, tabletDown } = useTimeAway();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_timeAway')}</Typography>

      {timeAwayList.length === 0 && (
        <Button
          variant="small"
          startIcon={<IconAdd />}
          sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
          onClick={handleAddTimeAway}
        >
          {t('tr_add')}
        </Button>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {timeAwayList.map((timeAwayItem, index) => (
          <TimeAwayItem
            key={timeAwayItem.id}
            timeAway={timeAwayItem}
            lastItem={index === timeAwayList.length - 1}
            onAdd={handleAddTimeAway}
            onDelete={() => handleDeleteTimeAway(timeAwayItem.id)}
            tabletDown={tabletDown}
          />
        ))}
      </Box>
    </ProfileItemContainer>
  );
};

export default UserTimeAway;
