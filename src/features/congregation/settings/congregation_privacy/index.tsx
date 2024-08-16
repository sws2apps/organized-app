import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../../shared_styles/components';
import { useAppTranslation } from '@hooks/index';
import useCongregationPrivacy from './useCongregationPrivacy';
import AccessCodeView from './access_code_view';
import MasterKeyView from './master_key_view';
import SwitchWithLabel from '@components/switch_with_label';

const CongregationPrivacy = () => {
  const { t } = useAppTranslation();

  const {
    timeAwayPublic,
    handleTimeAwayPublicToggle,
    outgoingTalksPublic,
    handleOutgoingTalksPublicToggle,
    isUserAdmin,
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
        <SwitchWithLabel
          label={t('tr_showOutgoingToAll')}
          helper={t('tr_showOutgoingToAllDesc')}
          checked={outgoingTalksPublic}
          onChange={handleOutgoingTalksPublicToggle}
        />
      </CardSectionContent>

      {isUserAdmin && (
        <>
          <MasterKeyView />
          <AccessCodeView />
        </>
      )}
    </CardSection>
  );
};

export default CongregationPrivacy;
