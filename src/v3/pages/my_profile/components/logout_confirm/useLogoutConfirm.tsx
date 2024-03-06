import { handleDeleteDatabase } from '@services/cpe';

const useLogoutConfirm = () => {
  const handleLogout = async () => {
    await handleDeleteDatabase();
  };

  return { handleLogout };
};

export default useLogoutConfirm;
