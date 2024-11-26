import { Stack } from '@mui/material';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useCongregationPrivacy from './useCongregationPrivacy';
import AccessCodeView from './access_code_view';
import DataSharing from './data_sharing';
import DeleteCongregation from './delete_congregation';
import MasterKeyView from './master_key_view';
import OutgoingTalkAccess from './outgoing_talk_access';
import SwitchWithLabel from '@components/switch_with_label';

const CongregationPrivacy = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { timeAwayPublic, handleTimeAwayPublicToggle, isConnected } =
    useCongregationPrivacy();

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
            readOnly={!isAdmin}
          />

          <OutgoingTalkAccess />
        </Stack>

        {isConnected && isAdmin && <MasterKeyView />}

        {isConnected && isAdmin && <AccessCodeView />}

        {isConnected && isAdmin && <DeleteCongregation />}
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationPrivacy;
