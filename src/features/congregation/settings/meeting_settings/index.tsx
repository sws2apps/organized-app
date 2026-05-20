import { Stack } from '@mui/material';
import { CardSection, CardSectionContent, CardSectionHeader } from '../shared_styles';
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
    <CardSection>
      <CardSectionHeader
        title={t('tr_meetingSettings')}
        description={t('tr_weeklyMeetingsDesc') || "Customize general and detailed settings for your congregation's weekly meetings"}
      />
      <CardSectionContent 
        marginTop="-8px !important"
        sx={{ 
          '& > hr': { display: 'none' },
          '& [role="tabpanel"] > div': { paddingBottom: '0 !important' } 
        }}
      >
        <Stack spacing="16px">
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
      </CardSectionContent>
    </CardSection>
  );
};

export default MeettingSettings;
