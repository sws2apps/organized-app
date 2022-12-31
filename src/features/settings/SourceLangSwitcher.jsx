import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { sourceLangState } from '../../states/main';
import { SOURCELANGUAGE_LIST } from '../../locales/langList';

const SourceLangSwitcher = () => {
  const { t } = useTranslation();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const [sourceLang, setSourceLang] = useRecoilState(sourceLangState);

  const [tempSourceLang, setTempSourceLang] = useState(sourceLang);

  const handleSourceLangChange = (e) => {
    setTempSourceLang(e.target.value);
  };

  const saveAppSettings = async () => {
    const obj = {};
    obj.source_lang = tempSourceLang;
    await dbUpdateAppSettings(obj);

    setSourceLang(tempSourceLang);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('settings.saved'));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography className={'settingHeader'}>{t('settings.sourceTemplateLang')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <Typography sx={{ marginBottom: '15px' }}>{t('settings.sourceTemplateLangDesc')}</Typography>

        <Box>
          <TextField
            id="outlined-select-class"
            select
            label={t('global.changeLanguage')}
            value={tempSourceLang}
            defaultValue={'e'}
            onChange={handleSourceLangChange}
            size="small"
            sx={{ minWidth: 100 }}
          >
            {SOURCELANGUAGE_LIST.map((lang) => (
              <MenuItem key={`source-language-${lang.code}`} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => saveAppSettings()}
          sx={{ marginTop: '10px' }}
        >
          {t('global.save')}
        </Button>
      </Box>
    </Box>
  );
};

export default SourceLangSwitcher;
