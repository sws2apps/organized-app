import { useRouteError } from 'react-router-dom';
import { useAppTranslation } from '@hooks';
import { userSignOut } from '@services/firebase/auth';
import { deleteAppDb } from '@services/dexie/app';

const useError = () => {
  const error = useRouteError();

  const { t } = useAppTranslation();

  const handleReload = () => {
    window.location.href = './';
  };

  const handleDelete = async () => {
    await deleteAppDb();
    await userSignOut();

    window.location.href = './';
  };

  return { t, handleReload, handleDelete, error };
};

export default useError;
