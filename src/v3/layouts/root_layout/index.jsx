import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { NavBar } from '@layouts';
import { AppModalWrapper } from '@wrapper/index';
import { Box, Container } from '@mui/material';
import { About, AppUpdater, Startup, Support } from '@features/index';
import useRootLayout from './useRootLayout';

const RootLayout = ({ updatePwa }) => {
  const { isAppLoad, isOpenAbout, isOpenSupport } = useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar />
      <AppUpdater updatePwa={updatePwa} />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          width: '100%',
          paddingLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
          paddingRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
          marginTop: '80px', // header 56px + 24px
        }}
      >
        {isOpenAbout && <About />}
        {isOpenSupport && <Support />}

        {isAppLoad && <Startup />}

        {!isAppLoad && (
          <Box sx={{ marginBottom: '32px' }}>
            <Outlet />
          </Box>
        )}
      </Container>
    </AppModalWrapper>
  );
};

RootLayout.propTypes = {
  updatePwa: PropTypes.func,
};

export default RootLayout;
