import { Stack } from '@mui/material';
import { CardSectionTitle } from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import MidweekSettings from './midweek';
import WeekendSettings from './weekend';
import Tabs from '@components/tabs';

const MeettingSettings = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="16px">
      <CardSectionTitle>{t('tr_meetingSettings')}</CardSectionTitle>
      <Tabs
        tabs={[
          {
            label: t('tr_midweek'),
            Component: <MidweekSettings />,
          },
          {
            label: t('tr_weekend'),
            Component: <WeekendSettings />,
          },
        ]}
      />
    </Stack>
  );
};

export default MeettingSettings;
