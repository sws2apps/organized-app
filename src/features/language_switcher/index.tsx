import {
  Box,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  SxProps,
} from '@mui/material';
import { IconGlobe, IconLanguage } from '@icons/index';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import useLanguage from './useLanguage';

const LanguageSwitcher = ({ menuStyle }: { menuStyle: SxProps }) => {
  const { t } = useAppTranslation();

  const {
    handleClick,
    anchorEl,
    isMenuOpen,
    handleClose,
    LANGUAGE_LIST,
    handleLocalizeOpen,
    handleLangChange,
    tabletDown,
    isAppLoad,
  } = useLanguage();

  return (
    <>
      <MenuItem disableRipple sx={menuStyle} onClick={handleClick} tabIndex={0}>
        <ListItemIcon
          sx={{
            '&.MuiListItemIcon-root': {
              width: '24px',
              minWidth: '24px !important',
            },
          }}
        >
          <IconLanguage color="var(--black)" />
        </ListItemIcon>
        {(tabletDown || !isAppLoad) && (
          <ListItemText>
            <Typography className="body-regular">
              {t('tr_changeLanguage')}
            </Typography>
          </ListItemText>
        )}
      </MenuItem>
      <Menu
        id="menu-language"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        sx={{
          padding: '8px 0',
          marginTop: '7px',
          '& li': {
            borderBottom: '1px solid var(--accent-200)',
          },
          '& li:last-child': {
            borderBottom: 'none',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        slotProps={{
          paper: {
            className: 'small-card-shadow',
            style: {
              borderRadius: 'var(--radius-l)',
              border: '1px solid var(--accent-200)',
              backgroundColor: 'var(--white)',
            },
          },
        }}
      >
        {LANGUAGE_LIST.map((lang) => (
          <MenuItem
            key={lang.threeLettersCode}
            onClick={() => handleLangChange(lang.threeLettersCode)}
          >
            <ListItemText>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Typography
                  className="label-small-medium"
                  color="var(--accent-dark)"
                  sx={{
                    backgroundColor: 'var(--accent-200)',
                    padding: '2px 3px',
                    borderRadius: 'var(--radius-s)',
                  }}
                >
                  {lang.code.toUpperCase()}
                </Typography>
                <Typography className="body-regular" color="var(--black)">
                  {lang.name}
                </Typography>
              </Box>
            </ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          sx={{
            padding: '8px 12px 8px 16px',
            minHeight: '40px',
            height: '40px',
          }}
          onClick={handleLocalizeOpen}
        >
          <Link
            href="https://github.com/sws2apps/organized-app/blob/main/TRANSLATION.md"
            target="_blank"
            rel="noopener"
            sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            underline="none"
          >
            <ListItemIcon
              sx={{
                '&.MuiListItemIcon-root': {
                  width: '24px',
                  minWidth: '24px !important',
                },
              }}
            >
              <IconGlobe color="var(--accent-dark)" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                className="body-small-semibold"
                color="var(--accent-dark)"
              >
                {t('tr_languageMissing')}
              </Typography>
            </ListItemText>
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
