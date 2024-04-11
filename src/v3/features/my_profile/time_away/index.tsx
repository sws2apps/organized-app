import { Box } from '@mui/material';
import { IconAdd, IconInfo } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';
import { ProfileItemContainer, SettingWithBorderContainer } from '../my_profile.styles';
import { useAppTranslation } from '@hooks/index';
import useTimeAway from './useTimeAway';
import TimeAwayItem from './components/TimeAwayItem';

const UserTimeAway = () => {
  const { t } = useAppTranslation();

  const { timeAwayList, handleUserTimeAwayAdd, handleUserTimeAwayDelete } = useTimeAway();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_timeAway')}</Typography>

      {timeAwayList.data.length === 0 && (
        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconInfo color="var(--grey-350)" />
            <Typography color="var(--grey-350)">{t('tr_timeAwayDesc')}</Typography>
          </Box>

          <Button
            variant="small"
            startIcon={<IconAdd />}
            sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
            onClick={handleUserTimeAwayAdd}
          >
            {t('tr_add')}
          </Button>
        </Box>
      )}

      {timeAwayList.data.length > 0 && (
        <SettingWithBorderContainer>
          {timeAwayList.data.map((timeAwayItem, index) => (
            <TimeAwayItem
              key={timeAwayItem.id}
              timeAway={timeAwayItem}
              lastItem={index === timeAwayList.data.length - 1}
              onAdd={handleUserTimeAwayAdd}
              onDelete={() => handleUserTimeAwayDelete(timeAwayItem.id)}
            />
          ))}
        </SettingWithBorderContainer>
      )}
    </ProfileItemContainer>
  );
};

export default UserTimeAway;
