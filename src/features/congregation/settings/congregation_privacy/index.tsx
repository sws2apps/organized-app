import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../../shared_styles/components';
import { useAppTranslation } from '@hooks/index';
import useCongregationPrivacy from './useCongregationPrivacy';
import AccessCodeView from './access_code_view';
import MasterKeyView from './master_key_view';
import OutgoingTalkAccess from './outgoing_talk_access';
import SwitchWithLabel from '@components/switch_with_label';

const CongregationPrivacy = () => {
  const { t } = useAppTranslation();

  const {
    timeAwayPublic,
    handleTimeAwayPublicToggle,
    isUserAdmin,
    isConnected,
  } = useCongregationPrivacy();

  return (
    <CardSection>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_congregationPrivacy')}
          description={t('tr_congregationSecurityDesc')}
        />
        <SwitchWithLabel
          label={t('tr_showAwayToAll')}
          helper={t('tr_showAwayToAllDesc')}
          checked={timeAwayPublic}
          onChange={handleTimeAwayPublicToggle}
        />

        <OutgoingTalkAccess />
      </CardSectionContent>

      {isConnected && isUserAdmin && (
        <>
          <MasterKeyView />
          <AccessCodeView />
        </>
      )}
    </CardSection>
  );
};

export default CongregationPrivacy;
