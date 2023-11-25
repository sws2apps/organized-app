import { DashboardCard } from '@features/index';
import { useAppTranslation } from '@hooks/index';

const MeetingsMaterialsCard = () => {
  const { t } = useAppTranslation();

  return <DashboardCard header={t('meetingMaterials')}></DashboardCard>;
};

export default MeetingsMaterialsCard;
