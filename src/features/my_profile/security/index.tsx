import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconDelete } from '@components/icons';
import {
  ProfileItemContainer,
  SettingWithBorderContainer,
} from '../index.styles';
import useSecurity from './useSecurity';
import Divider from '@components/divider';
import MFAEnable from './mfaEnable';
import MFADisable from './mfaDisable';
import Button from '@components/button';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import DeleteAccount from './delete_account';

const Security = () => {
  const { t } = useAppTranslation();

  const {
    handleToggleMFA,
    isMFAEnabled,
    isOpenMFAEnable,
    handleCloseDialog,
    isOpenMFADisable,
    accountType,
    handleCloseDelete,
    handleOpenDelete,
    isAccountDelete,
  } = useSecurity();

  return (
    <ProfileItemContainer>
      {isOpenMFAEnable && (
        <MFAEnable open={isOpenMFAEnable} onClose={handleCloseDialog} />
      )}

      {isOpenMFADisable && (
        <MFADisable open={isOpenMFADisable} onClose={handleCloseDialog} />
      )}

      {isAccountDelete && (
        <DeleteAccount open={isAccountDelete} onClose={handleCloseDelete} />
      )}

      <Typography className="h2">{t('tr_security')}</Typography>

      <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
        {accountType === 'vip' && (
          <SettingWithBorderContainer>
            <SwitcherContainer>
              <Switch checked={isMFAEnabled} onChange={handleToggleMFA} />
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <Typography>{t('tr_2FA')}</Typography>
                <Typography
                  className="label-small-regular"
                  color="var(--grey-350)"
                >
                  {t('tr_2FADesc')}
                </Typography>
              </Box>
            </SwitcherContainer>
          </SettingWithBorderContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            disableAutoStretch
            variant="small"
            color="red"
            onClick={handleOpenDelete}
            startIcon={<IconDelete />}
            sx={{ minHeight: '28px', height: '28px' }}
          >
            {t('tr_deleteAccount')}
          </Button>
        </Box>
      </Stack>
    </ProfileItemContainer>
  );
};

export default Security;
