import {
  CardSectionContent,
  CardSectionHeader,
} from '../../../shared_styles/components';
import { IconEncryptionKey, IconPinCode } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useAccessCodeView from './useAccessCodeView';
import AccessCodeChange from '../access_code_change';
import Button from '@components/button';
import TextField from '@components/textfield';

const AccessCodeView = () => {
  const { t } = useAppTranslation();

  const { accessCode, changeOpen, handleCloseChange, handleOpenChange } =
    useAccessCodeView();

  return (
    <CardSectionContent sx={{ gap: '16px' }}>
      <CardSectionHeader
        title={t('tr_congregationAccessCode')}
        description={t('tr_congregationAccessCodeDesc')}
      />

      <TextField
        type="password"
        variant="outlined"
        autoComplete="off"
        value={accessCode}
        startIcon={<IconEncryptionKey />}
        resetHelperPadding={true}
        InputProps={{ readOnly: true }}
      />
      <Button
        variant="small"
        sx={{
          alignSelf: 'flex-start',
          minHeight: '32px',
        }}
        startIcon={<IconPinCode />}
        onClick={handleOpenChange}
      >
        {t('tr_changeAccessCodeButton')}
      </Button>

      {changeOpen && (
        <AccessCodeChange open={changeOpen} onClose={handleCloseChange} />
      )}
    </CardSectionContent>
  );
};

export default AccessCodeView;
