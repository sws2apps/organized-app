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
import MasterKeyView from './master_key_view';
import OutgoingTalkAccess from './outgoing_talk_access';
import ShowAwayToAllChange from './time_away_visibility';

const CongregationPrivacy = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { isConnected } = useCongregationPrivacy();

  return (
    <Stack spacing="16px">
      <CardSection>
        <CardSectionHeader
          title={t('tr_congregationPrivacy')}
          description={t('tr_congregationSecurityDesc')}
        />

        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
          <Stack spacing="16px">
            <DataSharing />
            <ShowAwayToAllChange />
            <OutgoingTalkAccess />
          </Stack>
        </CardSectionContent>
      </CardSection>

      {isConnected && isAdmin && (
        <CardSection>
          <MasterKeyView />
        </CardSection>
      )}

      {isConnected && isAdmin && (
        <CardSection>
          <AccessCodeView />
        </CardSection>
      )}
    </Stack>
  );
};

export default CongregationPrivacy;
