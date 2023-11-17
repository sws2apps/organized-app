import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { NavBar } from '@layouts';
import { AppModalWrapper } from '@wrapper/index';
import { Container } from '@mui/material';

const RootLayout = ({ updatePwa }) => {
  console.log(updatePwa);
  return (
    <AppModalWrapper>
      <NavBar />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          padding: { mobile: '16px', tablet: '24px' },
        }}
      >
        <Outlet />
      </Container>
    </AppModalWrapper>
  );
};

RootLayout.propTypes = {
  updatePwa: PropTypes.func,
};

export default RootLayout;
