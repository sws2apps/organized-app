import { Box, MenuItem } from '@mui/material';
import Select from '@components/select';
import Switch from '@components/switch';
import { SwitcherItem } from '@components/global';
import Typography from '@components/typography';
import { ProfileItemContainer } from '../my_profile.styles';
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

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: 'column',
          '& > *:not(:last-child)': {
            borderBottom: '1px solid var(--accent-200)',
            paddingBottom: '16px',
          },
        }}
      >
        <SwitcherItem laptopUp={laptopUp}>
          <Switch checked={autoSync} onChange={(e) => handleSwitchAutoBackup(e.target.checked)} />
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
              <Typography className="label-small-regular" color="var(--grey-350)">
                {t('tr_autoSyncDesc')}
              </Typography>
            </Box>
            <Select
              label={t('tr_syncInterval')}
              value={autoSyncInterval}
              onChange={(e) => handleUpdateSyncInterval(e.target.value)}
              height={48}
              sx={{ width: '200px', minWidth: '200px' }}
            >
              {[5, 15, 30, 45].map((time) => (
                <MenuItem key={time} value={time}>
                  {`${time} ${t('tr_syncIntervalMinLabel')}`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </SwitcherItem>

        <SwitcherItem laptopUp={laptopUp}>
          <Switch checked={syncTheme} onChange={(e) => handleUpdateSyncTheme(e.target.checked)} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography>{t('tr_autoThemeChange')}</Typography>
            <Typography className="label-small-regular" color="var(--grey-350)">
              {t('tr_autoThemeChangeDesc')}
            </Typography>
          </Box>
        </SwitcherItem>
      </Box>
    </ProfileItemContainer>
  );
};

export default AppSettings;
