import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { NavBar } from '@layouts';
import { AppModalWrapper } from '@wrapper/index';
import { Container } from '@mui/material';
import { AppUpdater, Startup } from '@features/index';
import useRootLayout from './useRootLayout';

const RootLayout = ({ updatePwa }) => {
  const { isAppLoad, isEmailAuth } = useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar />
      <AppUpdater updatePwa={updatePwa} />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          padding: { mobile: '16px', tablet: '24px' },
          marginTop: '50px',
        }}
      >
        {isAppLoad && !isEmailAuth && <Startup />}

        {!isAppLoad && <Outlet />}
      </Container>
    </AppModalWrapper>
  );
};

RootLayout.propTypes = {
  updatePwa: PropTypes.func,
};

export default RootLayout;
