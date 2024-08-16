import {
  CardSectionContent,
  CardSectionHeader,
} from '../../shared_styles/components';
import { IconEncryptionKey, IconPinCode } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useMasterKeyView from './useMasterKeyView';
import Button from '@components/button';
import MasterKeyChange from '../master_key_change';
import TextField from '@components/textfield';

const MasterKeyView = () => {
  const { t } = useAppTranslation();

  const { masterKey, changeOpen, handleCloseChange, handleOpenChange } =
    useMasterKeyView();

  return (
    <CardSectionContent sx={{ gap: '16px' }}>
      <CardSectionHeader
        title={t('tr_congregationMasterKey')}
        description={t('tr_congregationMasterKeyDesc')}
      />

      <TextField
        type="password"
        variant="outlined"
        autoComplete="off"
        value={masterKey}
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
        {t('tr_changeKeyButton')}
      </Button>

      {changeOpen && (
        <MasterKeyChange open={changeOpen} onClose={handleCloseChange} />
      )}
    </CardSectionContent>
  );
};

export default MasterKeyView;
