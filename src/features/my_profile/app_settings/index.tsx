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

const AppSettings = () => {
  const { t } = useAppTranslation();

  const {
    autoSync,
    handleSwitchAutoBackup,
    autoSyncInterval,
    handleUpdateSyncInterval,
    laptopUp,
    handleUpdateSyncTheme,
    syncTheme,
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

        <SwitcherContainer>
          <Switch
            checked={syncTheme}
            onChange={(e) => handleUpdateSyncTheme(e.target.checked)}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography>{t('tr_autoThemeChange')}</Typography>
            <Typography className="label-small-regular" color="var(--grey-350)">
              {t('tr_autoThemeChangeDesc')}
            </Typography>
          </Box>
        </SwitcherContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h4">{t('tr_colorScheme')}</Typography>

          <ColorSchemeSwitcher />
        </Box>
      </SettingWithBorderContainer>
    </ProfileItemContainer>
  );
};

export default AppSettings;
