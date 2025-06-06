import { Stack } from '@mui/material';
import { CardSectionTitle } from '../shared_styles';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMeetingSettings from './useMeetingSettings';
import SwitchWithLabel from '@components/switch_with_label';
import Tabs from '@components/tabs';

const MeettingSettings = () => {
  const { t } = useAppTranslation();

  const { isGroup, isLanguageGroupOverseer } = useCurrentUser();

  const {
    handleToggleMidweek,
    handleToggleWeekend,
    hasMidweek,
    hasWeekend,
    tabs,
    value,
    handleTabChange,
  } = useMeetingSettings();

  return (
    <Stack spacing="16px">
      <CardSectionTitle>{t('tr_meetingSettings')}</CardSectionTitle>

      {isGroup && (
        <>
          <SwitchWithLabel
            label={t('tr_separateMidweekMeeting')}
            checked={hasMidweek}
            onChange={handleToggleMidweek}
            readOnly={!isLanguageGroupOverseer}
          />

          <SwitchWithLabel
            label={t('tr_separateWeekendMeeting')}
            checked={hasWeekend}
            onChange={handleToggleWeekend}
            readOnly={!isLanguageGroupOverseer}
          />
        </>
      )}

      {tabs.length > 0 && (
        <Tabs tabs={tabs} value={value} onChange={handleTabChange} />
      )}
    </Stack>
  );
};

export default MeettingSettings;
