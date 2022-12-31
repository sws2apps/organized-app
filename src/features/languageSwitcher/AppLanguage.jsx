import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getI18n, useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import TranslateIcon from '@mui/icons-material/Translate';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../states/main';
import { UILANGUAGE_LIST } from '../../locales/langList.js';

const AppLanguage = () => {
  const { t, i18n } = useTranslation();

  const [appLang, setAppLang] = useRecoilState(appLangState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [appLangLocal, setAppLangLocal] = useState(appLang);
  const [userChange, setUserChange] = useState(false);

  const theme = useTheme();
  const largeView = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });

  let isMenuOpen = Boolean(anchorEl);

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

  useEffect(() => {
    const updateLang = async () => {
      if (userChange) {
        await i18n.changeLanguage(appLangLocal);

        const isoLang = getI18n().getDataByLanguage(appLangLocal).translation['global.iso'];
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLangLocal);

        localStorage.setItem('app_lang', appLangLocal);
        setUserChange(false);
      } else {
        let appLang = localStorage.getItem('app_lang') || 'e';
        await i18n.changeLanguage(appLang);

        const isoLang = getI18n().getDataByLanguage(appLang).translation['global.iso'];
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLang);
      }
    };

    updateLang();
  }, [appLangLocal, i18n, setAppLang, userChange]);

  return (
    <>
      <Tooltip title={largeView ? '' : t('global.changeLanguage')}>
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
          {largeView && <Typography sx={{ marginLeft: '5px' }}>{t('global.changeLanguage')}</Typography>}
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-language"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        sx={{ padding: 0 }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {UILANGUAGE_LIST.map((lang) => (
          <MenuItem key={lang.code} onClick={handleLangChange} sx={{ padding: 0 }}>
            <ListItemText data-code={lang.code}>
              <Typography sx={{ padding: '6px 16px' }}>{lang.name}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AppLanguage;
