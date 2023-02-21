import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import LanguageIcon from '@mui/icons-material/Language';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { sourceLangState } from '../../states/main';
import { LANGUAGE_LIST } from '../../locales/langList';
import { scheduleUseFullnameState } from '../../states/schedule';

const SourcesFormsSettings = () => {
  const { t } = useTranslation('ui');

  const [scheduleUseFullname, setScheduleUseFullname] = useRecoilState(scheduleUseFullnameState);
  const [sourceLang, setSourceLang] = useRecoilState(sourceLangState);

  const [tempSourceLang, setTempSourceLang] = useState(sourceLang);
  const [useFullname, setUseFullname] = useState(scheduleUseFullname);

  const listSourceLangs = LANGUAGE_LIST.filter((lang) => lang.isSource === true);

  const handleSourceLangChange = async (e) => {
    if (e.target.value === 'not_set') return;
    setTempSourceLang(e.target.value);
    await dbUpdateAppSettings({ source_lang: e.target.value });
    setSourceLang(e.target.value);
  };

  const handleChangeFullnameSwitch = async (value) => {
    setUseFullname(value);
    setScheduleUseFullname(value);
    await dbUpdateAppSettings({ schedule_useFullname: value });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography className={'settingHeader'}>{t('sourcesFormsSettings')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Box>
          <Typography sx={{ marginBottom: '15px' }}>{t('sourceTemplateLangDesc')}</Typography>

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

        <Box>
          <FormControlLabel
            control={<Checkbox checked={useFullname} onChange={(e) => handleChangeFullnameSwitch(e.target.checked)} />}
            label={t('scheduleUseFullname')}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SourcesFormsSettings;
