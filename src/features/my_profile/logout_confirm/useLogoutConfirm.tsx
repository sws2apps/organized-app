import { handleDeleteDatabase } from '@services/app';

const useLogoutConfirm = () => {
  const handleLogout = async () => {
    await handleDeleteDatabase();
  };

  return { handleLogout };
};

export default useLogoutConfirm;
