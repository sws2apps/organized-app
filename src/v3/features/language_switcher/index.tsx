import { Link, ListItemIcon, ListItemText, Menu, MenuItem, SxProps } from '@mui/material';
import { IconGlobe, IconLanguage } from '@icons/index';
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
    laptopUp,
    tabletDown,
  } = useLanguage();

  return (
    <>
      <MenuItem disableRipple sx={menuStyle} onClick={handleClick}>
        <ListItemIcon sx={{ '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px' } }}>
          <IconLanguage color="var(--black)" />
        </ListItemIcon>
        {(laptopUp || tabletDown) && (
          <ListItemText>
            <Typography className="body-regular">{t('tr_changeLanguage')}</Typography>
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
            disableRipple
            key={lang.locale}
            onClick={handleLangChange}
            sx={{
              padding: '8px 12px 8px 16px',
              height: '36px',
              minHeight: '36px',
              '&:hover': {
                backgroundColor: 'var(--accent-100)',
                '& p': {
                  color: 'var(--accent-dark)',
                },
              },
            }}
          >
            <ListItemText data-code={lang.code}>
              <Typography className="body-regular" color="var(--black)">
                {lang.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          disableRipple
          sx={{ padding: '8px 12px 8px 16px', minHeight: '40px', height: '40px' }}
          onClick={handleLocalizeOpen}
        >
          <Link
            href="https://github.com/sws2apps/cpe-sws/blob/main/TRANSLATION.md"
            target="_blank"
            rel="noopener"
            sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            underline="none"
          >
            <ListItemIcon sx={{ '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px' } }}>
              <IconGlobe color="var(--accent-dark)" />
            </ListItemIcon>
            <ListItemText>
              <Typography className="body-small-semibold" color="var(--accent-dark)">
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
