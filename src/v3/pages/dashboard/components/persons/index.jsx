import { DashboardCard } from '@features/index';
import { useAppTranslation } from '@hooks/index';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  return <DashboardCard header={t('persons')}></DashboardCard>;
};

export default PersonsCard;
