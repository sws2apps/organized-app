import { Checkbox } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import { SettingWithBorderContainer } from '../../index.styles';
import CreatePin from '@features/app_lock/create_pin';
import useAppLockToggle from './useAppLockToggle';
import {
  AppLockHeaderRow,
  AppLockLabelStack,
  AppLockSecondRow,
  BiometricLabelStack,
  BiometricRow,
  ChangePinTrigger,
} from './index.styles';

const LOCK_AFTER_OPTIONS: number[] = [0, 1, 5, 15, 30, -1];

const AppLockSection = () => {
  const { t } = useAppTranslation();

  const {
    enabled,
    lockAfter,
    biometricEnabled,
    biometricSupported,
    isCreatePinOpen,
    createPinMode,
    handleToggle,
    handleCloseDialog,
    handleChangePIN,
    handleLockAfterChange,
    handleBiometricToggle,
  } = useAppLockToggle();

  const renderLockAfterLabel = (value: number) => {
    if (value === 0) return t('tr_lockAfterImmediately');
    if (value === -1) return t('tr_lockAfterNever');
    return `${value} ${t('tr_minLabel')}`;
  };

  return (
    <>
      {isCreatePinOpen && (
        <CreatePin
          open={isCreatePinOpen}
          mode={createPinMode}
          onClose={handleCloseDialog}
        />
      )}

      <SettingWithBorderContainer>
        <SwitcherContainer>
          <Switch checked={enabled} onChange={handleToggle} />
          <AppLockHeaderRow>
            <AppLockLabelStack>
              <Typography>{t('tr_lockAppWithPIN')}</Typography>
              <Typography
                className="label-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_lockAppWithPINDesc')}
              </Typography>
            </AppLockLabelStack>
            {enabled && (
              <ChangePinTrigger onClick={handleChangePIN} role="button">
                <Typography className="button-caps" color="var(--accent-main)">
                  {`*** ${t('tr_changePIN')}`}
                </Typography>
              </ChangePinTrigger>
            )}
          </AppLockHeaderRow>
        </SwitcherContainer>

        {enabled && (
          <AppLockSecondRow>
            <Select
              label={t('tr_lockAfter')}
              value={lockAfter.toString()}
              onChange={(e) => handleLockAfterChange(+e.target.value)}
              sx={{ maxWidth: { mobile: '100%', laptop: '200px' } }}
            >
              {LOCK_AFTER_OPTIONS.map((value) => (
                <MenuItem key={value} value={value.toString()}>
                  <Typography className="body-regular" color="var(--black)">
                    {renderLockAfterLabel(value)}
                  </Typography>
                </MenuItem>
              ))}
            </Select>

            {biometricSupported && (
              <BiometricRow>
                <Checkbox
                  checked={biometricEnabled}
                  onChange={(e) => handleBiometricToggle(e.target.checked)}
                  sx={{ padding: 0, marginTop: '2px' }}
                />
                <BiometricLabelStack>
                  <Typography>{t('tr_useBiometricsForUnlock')}</Typography>
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {t('tr_useBiometricsForUnlockDesc')}
                  </Typography>
                </BiometricLabelStack>
              </BiometricRow>
            )}
          </AppLockSecondRow>
        )}
      </SettingWithBorderContainer>
    </>
  );
};

export default AppLockSection;
