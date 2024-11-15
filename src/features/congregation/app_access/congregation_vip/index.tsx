import { useAppTranslation } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import UsersContainer from '../users_container';
import WaitingLoader from '@components/waiting_loader';

const CongregationVIP = ({
  admins,
  brothers,
  isLoading,
}: CongregationVIPType) => {
  const { t } = useAppTranslation();

  return (
    <UsersContainer
      title={t('tr_baptizedAndAppointed')}
      description={t('tr_baptizedAndAppointedDesc')}
    >
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && (
        <>
          <CongregationAdmin users={admins} />
          <Divider color="var(--accent-200)" />
          <CongregationBaptized users={brothers} />
        </>
      )}
    </UsersContainer>
  );
};

export default CongregationVIP;
