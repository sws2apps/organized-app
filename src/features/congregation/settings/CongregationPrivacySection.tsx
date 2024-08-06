import useAppTranslation from '@hooks/useAppTranslation';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from './CardSection';
import SwitchItem from './SwitchItem';
import { useState } from 'react';
import { Button, TextField } from '@components/index';
import { IconEncryptionKey, IconPinCode } from '@components/icons';

const CongregationPrivacySection = () => {
  const { t } = useAppTranslation();

  const [showTimeAway, setShowTimeAway] = useState(true);
  const [showOutgoingSpeakers, setShowOutgoingSpeakers] = useState(true);
  const [congregationAccessCode, setCongregationAccessCode] = useState('');

  return (
    <CardSection>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_congregationPrivacy')}
          description={t('tr_congregationSecurityDesc')}
        />
        <SwitchItem
          label={t('tr_showAwayToAll')}
          helper={t('tr_showAwayToAllDesc')}
          value={showTimeAway}
          setValue={setShowTimeAway}
        />
        <SwitchItem
          label={t('tr_showOutgoingToAll')}
          helper={t('tr_showOutgoingToAllDesc')}
          value={showOutgoingSpeakers}
          setValue={setShowOutgoingSpeakers}
        />
      </CardSectionContent>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_congregationAccessCode')}
          description={t('tr_congregationAccessCodeDesc')}
        />
        <TextField
          type="password"
          variant="outlined"
          autoComplete="off"
          value={congregationAccessCode}
          onChange={(e) => setCongregationAccessCode(e.target.value)}
          startIcon={<IconEncryptionKey />}
          resetHelperPadding={true}
        />
        <Button
          variant="small"
          sx={{
            alignSelf: 'flex-start',
            minHeight: '32px',
          }}
          startIcon={<IconPinCode />}
        >
          {t('tr_changeAccessCodeButton')}
        </Button>
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationPrivacySection;
