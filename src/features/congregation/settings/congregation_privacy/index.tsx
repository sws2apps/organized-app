import { Stack } from '@mui/material';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import useCongregationPrivacy from './useCongregationPrivacy';
import AccessCodeView from './access_code_view';
import DataSharing from './data_sharing';
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
      <CardSectionHeader
        title={t('tr_congregationPrivacy')}
        description={t('tr_congregationSecurityDesc')}
      />

      <CardSectionContent spacing="16px">
        <Stack spacing="16px">
          <DataSharing />

          <SwitchWithLabel
            label={t('tr_showAwayToAll')}
            helper={t('tr_showAwayToAllDesc')}
            checked={timeAwayPublic}
            onChange={handleTimeAwayPublicToggle}
          />

          <OutgoingTalkAccess />
        </Stack>

        {isConnected && isUserAdmin && <MasterKeyView />}

        {isConnected && isUserAdmin && <AccessCodeView />}
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationPrivacy;
