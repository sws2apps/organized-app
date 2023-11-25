import { DashboardCard } from '@features/index';
import { useAppTranslation } from '@hooks/index';

const ReportsCard = () => {
  const { t } = useAppTranslation();

  return <DashboardCard header={t('reports')}></DashboardCard>;
};

export default ReportsCard;
