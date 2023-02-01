import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getI18n, useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import TranslateIcon from '@mui/icons-material/Translate';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../states/main';
import { LANGUAGE_LIST } from '../../locales/langList.js';

const AppLanguage = () => {
  const { t, i18n } = useTranslation('ui');

  const [appLang, setAppLang] = useRecoilState(appLangState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [appLangLocal, setAppLangLocal] = useState(appLang);
  const [userChange, setUserChange] = useState(false);

  const theme = useTheme();
  const largeView = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });

  let isMenuOpen = Boolean(anchorEl);

  const listUILangs = LANGUAGE_LIST.filter((lang) => lang.isUI === true);

  const handleLangChange = async (e) => {
    setUserChange(true);
    const app_lang = e.target.parentElement.dataset.code;
    setAppLangLocal(app_lang);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocalizeOpen = () => {
    handleClose();
  };

  useEffect(() => {
    const updateLang = async () => {
      if (userChange) {
        await i18n.changeLanguage(appLangLocal);

        const isoLang = getI18n().getDataByLanguage(appLangLocal).ui['iso'];
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLangLocal);

        localStorage.setItem('app_lang', appLangLocal);
        setUserChange(false);
      } else {
        let appLang = localStorage.getItem('app_lang') || 'e';
        await i18n.changeLanguage(appLang);

        const isoLang = getI18n().getDataByLanguage(appLang).ui['iso'];
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLang);
      }
    };

    updateLang();
  }, [appLangLocal, i18n, setAppLang, userChange]);

  return (
    <>
      <Tooltip title={largeView ? '' : t('changeLanguage')}>
        <IconButton
          color="inherit"
          edge="start"
          sx={{
            borderRadius: '8px',
            '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
              borderRadius: 0,
              backgroundColor: 'rgba(23, 32, 42, .3)',
            },
          }}
          onClick={handleClick}
        >
          <TranslateIcon />
          {largeView && <Typography sx={{ marginLeft: '5px' }}>{t('changeLanguage')}</Typography>}
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-language"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        sx={{ padding: 0, marginTop: '10px' }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {listUILangs.map((lang) => (
          <MenuItem key={lang.code} onClick={handleLangChange} sx={{ padding: 0 }}>
            <ListItemText data-code={lang.code}>
              <Typography sx={{ padding: '6px 16px' }}>{lang.name}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
        <MenuItem sx={{ padding: 0, borderTop: '1px outset', marginTop: '10px' }} onClick={handleLocalizeOpen}>
          <Link href="https://github.com/sws2apps/lmm-oa-sws/blob/main/TRANSLATION.md" target="_blank" rel="noopener">
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
      </Menu>
    </>
  );
};

export default AppLanguage;
