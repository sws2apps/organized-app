import { useAppTranslation } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import FeatureFlag from '@components/feature_flag';
import JoinRequests from '../join_requests';
import UsersContainer from '../users_container';
import WaitingLoader from '@components/waiting_loader';

const CongregationVIP = ({ isLoading }: CongregationVIPType) => {
  const { t } = useAppTranslation();

  return (
    <UsersContainer
      title={t('tr_baptizedAndAppointed')}
      description={t('tr_baptizedAndAppointedDesc')}
    >
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && (
        <>
          <FeatureFlag flag="REQUEST_ACCESS_CONGREGATION">
            <JoinRequests />
          </FeatureFlag>
          <CongregationAdmin />
          <Divider color="var(--accent-200)" />
          <CongregationBaptized />
        </>
      )}
    </UsersContainer>
  );
};

export default CongregationVIP;
