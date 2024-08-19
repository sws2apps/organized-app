import { useAppTranslation } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import UsersContainer from '../users_container';

const CongregationVIP = ({ admins, brothers }: CongregationVIPType) => {
  const { t } = useAppTranslation();

  return (
    <UsersContainer
      title={t('tr_baptizedAndAppointed')}
      description={t('tr_baptizedAndAppointedDesc')}
    >
      <CongregationAdmin users={admins} />
      <Divider color="var(--accent-200)" />
      <CongregationBaptized users={brothers} />
    </UsersContainer>
  );
};

export default CongregationVIP;
