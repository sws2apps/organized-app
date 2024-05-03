import { useRouteError } from 'react-router-dom';
import { useAppTranslation } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import { dbAppDelete } from '@services/dexie/app';

/**
 * Custom hook to manage error handling.
 *
 * @returns {{
 *   t: Function,
 *   handleReload: Function,
 *   handleDelete: Function,
 *   error: { message?: string; data?: string }
 * }} Object containing functions and error data.
 */
const useError = () => {
  const error: { message?: string; data?: string } = useRouteError();

  const { t } = useAppTranslation();

  const handleReload = () => {
    window.location.href = './';
  };

  const handleDelete = async () => {
    await dbAppDelete();
    await userSignOut();

    window.location.href = './';
  };

  return { t, handleReload, handleDelete, error };
};

export default useError;
