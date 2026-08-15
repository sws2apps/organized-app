import { Box } from '@mui/material';
import ColorSchemeSwitcher from '@features/color_scheme_selector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import {
  ProfileItemContainer,
  SettingWithBorderContainer,
} from '../index.styles';
import { useAppTranslation } from '@hooks/index';
import useAppSettings from './useAppSettings';
import useThemeSwitcher from '@features/theme_switcher/useThemeSwitcher';

const AppSettings = () => {
  const { t } = useAppTranslation();
  const { isDark, handleChangeTheme } = useThemeSwitcher();

  const {
    autoSync,
    handleSwitchAutoBackup,
    autoSyncInterval,
    handleUpdateSyncInterval,
    laptopUp,
    handleUpdateSyncTheme,
    syncTheme,
    haptics,
    handleUpdateHaptics,
    showHaptics,
  } = useAppSettings();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_organizedSettings')}</Typography>

      <SettingWithBorderContainer>
        <SwitcherContainer>
          <Switch
            checked={autoSync}
            onChange={(e) => handleSwitchAutoBackup(e.target.checked)}
          />
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
              <Typography>{t('tr_autoSync')}</Typography>
              <Typography
                className="label-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_autoSyncDesc')}
              </Typography>
            </Box>
            <Select
              label={t('tr_syncInterval')}
              value={autoSyncInterval.toString()}
              onChange={(e) => handleUpdateSyncInterval(+e.target.value)}
              sx={{ maxWidth: '200px' }}
            >
              {[5, 15, 30, 45].map((time) => (
                <MenuItem key={time} value={time.toString()}>
                  <Typography className="body-regular" color="var(--black)">
                    {`${time} ${t('tr_minLabel')}`}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </SwitcherContainer>

        {/* One group: the container draws a divider between direct children. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SwitcherContainer>
            <Switch
              checked={syncTheme}
              onChange={(e) => handleUpdateSyncTheme(e.target.checked)}
            />
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
                <Typography>{t('tr_autoThemeChange')}</Typography>
                <Typography
                  className="label-small-regular"
                  color="var(--grey-350)"
                >
                  {t('tr_autoThemeChangeDesc')}
                </Typography>
              </Box>
              {!syncTheme && (
                <Select
                  label={t('tr_theme')}
                  value={isDark ? 'dark' : 'light'}
                  onChange={(e) => handleChangeTheme(e.target.value === 'dark')}
                  sx={{ maxWidth: '200px' }}
                >
                  <MenuItem value="light">
                    <Typography className="body-regular" color="var(--black)">
                      {t('tr_modeLight')}
                    </Typography>
                  </MenuItem>
                  <MenuItem value="dark">
                    <Typography className="body-regular" color="var(--black)">
                      {t('tr_modeDark')}
                    </Typography>
                  </MenuItem>
                </Select>
              )}
            </Box>
          </SwitcherContainer>

          {showHaptics && (
            <SwitcherContainer>
              <Switch
                checked={haptics}
                onChange={(e) => handleUpdateHaptics(e.target.checked)}
              />
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
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <Typography>{t('tr_hapticFeedback')}</Typography>
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {t('tr_hapticFeedbackDesc')}
                  </Typography>
                </Box>
              </Box>
            </SwitcherContainer>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h4">{t('tr_colorScheme')}</Typography>

          <ColorSchemeSwitcher />
        </Box>
      </SettingWithBorderContainer>
    </ProfileItemContainer>
  );
};

export default AppSettings;
