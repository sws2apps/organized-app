import { Box } from '@mui/material';
import { IconPinCode } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import CreatePin from '@features/app_lock/create_pin';
import { SettingWithBorderContainer } from '../../index.styles';
import useAppLockToggle from './useAppLockToggle';

const LOCK_AFTER_OPTIONS = [1, 5, 15, 30, -1];

const AppLockSection = () => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  const {
    enabled,
    lockAfterMinutes,
    biometricEnabled,
    biometricSupported,
    isBiometricProcessing,
    createPinMode,
    handleToggle,
    handleChangePin,
    handleCloseDialog,
    handleLockAfterChange,
    handleBiometricToggle,
  } = useAppLockToggle();

  return (
    <SettingWithBorderContainer>
      {createPinMode && (
        <CreatePin open mode={createPinMode} onClose={handleCloseDialog} />
      )}

      <SwitcherContainer>
        <Switch checked={enabled} onChange={handleToggle} />
        <Box
          sx={{
            display: 'flex',
            alignItems: laptopUp ? 'center' : 'flex-start',
            gap: '16px',
            justifyContent: 'space-between',
            flexGrow: 1,
            flexDirection: laptopUp ? 'row' : 'column',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography>{t('tr_lockAppWithPIN')}</Typography>
            <Typography
              className="label-small-regular"
              sx={{ color: 'var(--grey-350)' }}
            >
              {t('tr_lockAppWithPINDesc')}
            </Typography>
          </Box>

          {enabled && (
            <Select
              label={t('tr_appLockAutoAfter')}
              value={lockAfterMinutes.toString()}
              onChange={(e) => handleLockAfterChange(Number(e.target.value))}
              sx={{ maxWidth: '200px' }}
            >
              {LOCK_AFTER_OPTIONS.map((minutes) => (
                <MenuItem key={minutes} value={minutes.toString()}>
                  <Typography className="body-regular">
                    {minutes === -1
                      ? t('tr_appLockAutoNever')
                      : `${minutes} ${t('tr_minLabel')}`}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </SwitcherContainer>

      {enabled && (
        <Box
          sx={{
            display: 'flex',
            alignItems: laptopUp ? 'center' : 'flex-start',
            gap: '16px',
            justifyContent: 'space-between',
            flexDirection: laptopUp ? 'row' : 'column',
          }}
        >
          {biometricSupported && (
            <Checkbox
              checked={biometricEnabled}
              disabled={isBiometricProcessing}
              onChange={(_, checked) => handleBiometricToggle(checked)}
              label={t('tr_appLockBiometric')}
              labelDescription={t('tr_appLockBiometricDesc')}
            />
          )}

          <Button
            variant="small"
            disableAutoStretch
            onClick={handleChangePin}
            startIcon={<IconPinCode />}
            sx={{ marginLeft: laptopUp ? 'auto' : 0 }}
          >
            {t('tr_PINChange')}
          </Button>
        </Box>
      )}
    </SettingWithBorderContainer>
  );
};

export default AppLockSection;
