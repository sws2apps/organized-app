import {
  CardSectionContent,
  CardSectionTitle,
} from '../shared_styles/components';
import { useAppTranslation } from '@hooks/index';
import MidweekSettings from './midweek';
import WeekendSettings from './weekend';
import Tabs from '@components/tabs';

const MeettingSettings = () => {
  const { t } = useAppTranslation();

  return (
    <CardSectionContent>
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
    </CardSectionContent>
  );
};

export default MeettingSettings;
