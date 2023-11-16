import { Outlet } from 'react-router-dom';
import { NavBar } from '@layouts';
import { AppModalWrapper } from '@wrapper/index';

const RootLayout = () => {
  return (
    <AppModalWrapper>
      <NavBar />

      <Outlet />
    </AppModalWrapper>
  );
};

export default RootLayout;
