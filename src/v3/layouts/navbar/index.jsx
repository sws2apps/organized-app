import { Box, Container } from '@mui/material';
import logo from '@assets/img/logo.svg';
import { Typography } from '@components';
import { LanguageSwitcher, ThemeSwitcher } from '@features/index';
import { useAppTranslation } from '@hooks/index';
import useNavbar from './useNavbar';

const NavBar = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useNavbar();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--accent-100)',
        borderBottom: '1px solid var(--accent-200)',
        height: '56px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          padding: { mobile: '8px 16px', tablet: '8px 32px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '8px', tablet: '16px' } }}>
          <img src={logo} alt="logo" style={{ height: '40px', width: '40px' }} />
          <Typography variant="h3" color="var(--black)">
            {tabletUp ? t('appFullName') : t('appShortName')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '0px', tablet: '8px' } }}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </Box>
      </Container>
    </Box>
  );
};

export default NavBar;
