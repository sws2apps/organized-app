import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LanguageIcon from '@mui/icons-material/Language';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { sourceLangState } from '../../states/main';
import { LANGUAGE_LIST } from '../../locales/langList';

const SourceLangSwitcher = () => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const [sourceLang, setSourceLang] = useRecoilState(sourceLangState);

  const [tempSourceLang, setTempSourceLang] = useState(sourceLang);

  const listSourceLangs = LANGUAGE_LIST.filter((lang) => lang.isSource === true);

  const handleSourceLangChange = (e) => {
    if (e.target.value === 'not_set') return;
    setTempSourceLang(e.target.value);
  };

  const saveAppSettings = async () => {
    const obj = {};
    obj.source_lang = tempSourceLang;
    await dbUpdateAppSettings(obj);

    setSourceLang(tempSourceLang);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('saved'));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography className={'settingHeader'}>{t('sourceTemplateLang')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <Typography sx={{ marginBottom: '15px' }}>{t('sourceTemplateLangDesc')}</Typography>

        <Box>
          <TextField
            id="outlined-select-class"
            select
            label={t('changeLanguage')}
            value={tempSourceLang}
            defaultValue={'e'}
            onChange={handleSourceLangChange}
            size="small"
            sx={{ minWidth: 100 }}
          >
            {listSourceLangs.map((lang) => (
              <MenuItem key={`source-language-${lang.code}`} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
            <MenuItem sx={{ padding: 0, borderTop: '1px outset', marginTop: '10px' }} value="not_set">
              <Link
                href="https://github.com/sws2apps/lmm-oa-sws/blob/main/TRANSLATION.md"
                target="_blank"
                rel="noopener"
              >
                <Box sx={{ padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon>
                    <LanguageIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ fontSize: '14px' }}>{t('languageMissing')}</Typography>
                  </ListItemText>
                </Box>
              </Link>
            </MenuItem>
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => saveAppSettings()}
          sx={{ marginTop: '10px' }}
        >
          {t('save')}
        </Button>
      </Box>
    </Box>
  );
};

export default SourceLangSwitcher;
