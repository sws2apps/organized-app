import { DashboardCard } from '@features/index';
import { useAppTranslation } from '@hooks/index';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  return <DashboardCard header={t('congregation')}></DashboardCard>;
};

export default CongregationCard;
