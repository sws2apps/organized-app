import { IconAdd } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';
import { ProfileItemContainer, SettingWithBorderContainer } from '../my_profile.styles';
import { useAppTranslation } from '@hooks/index';
import useTimeAway from './useTimeAway';
import TimeAwayItem from './components/TimeAwayItem';

const UserTimeAway = () => {
  const { t } = useAppTranslation();

  const { timeAwayList, tabletDown, handleUserTimeAwayAdd, handleUserTimeAwayDelete } = useTimeAway();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_timeAway')}</Typography>

      {timeAwayList.data.length === 0 && (
        <Button
          variant="small"
          startIcon={<IconAdd />}
          sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
          onClick={handleUserTimeAwayAdd}
        >
          {t('tr_add')}
        </Button>
      )}

      <SettingWithBorderContainer>
        {timeAwayList.data.map((timeAwayItem, index) => (
          <TimeAwayItem
            key={timeAwayItem.id}
            timeAway={timeAwayItem}
            lastItem={index === timeAwayList.data.length - 1}
            onAdd={handleUserTimeAwayAdd}
            onDelete={() => handleUserTimeAwayDelete(timeAwayItem.id)}
            tabletDown={tabletDown}
          />
        ))}
      </SettingWithBorderContainer>
    </ProfileItemContainer>
  );
};

export default UserTimeAway;
