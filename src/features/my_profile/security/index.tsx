import { Box } from '@mui/material';
import SwitcherContainer from '@components/switcher_container';
import Switch from '@components/switch';
import Typography from '@components/typography';
import useSecurity from './useSecurity';
import {
  ProfileItemContainer,
  SettingWithBorderContainer,
} from '../index.styles';
import { useAppTranslation } from '@hooks/index';
import MFAEnable from './mfaEnable';
import MFADisable from './mfaDisable';

const Security = () => {
  const { t } = useAppTranslation();

  const {
    handleToggleMFA,
    isMFAEnabled,
    isOpenMFAEnable,
    handleCloseDialog,
    isOpenMFADisable,
  } = useSecurity();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_security')}</Typography>

      {isOpenMFAEnable && (
        <MFAEnable open={isOpenMFAEnable} onClose={handleCloseDialog} />
      )}
      {isOpenMFADisable && (
        <MFADisable open={isOpenMFADisable} onClose={handleCloseDialog} />
      )}

      <SettingWithBorderContainer>
        <SwitcherContainer>
          <Switch checked={isMFAEnabled} onChange={handleToggleMFA} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography>{t('tr_2FA')}</Typography>
            <Typography className="label-small-regular" color="var(--grey-350)">
              {t('tr_2FADesc')}
            </Typography>
          </Box>
        </SwitcherContainer>
      </SettingWithBorderContainer>
    </ProfileItemContainer>
  );
};

export default Security;
