import { useRouteError } from 'react-router-dom';
import { useAppTranslation } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import { dbAppDelete } from '@services/dexie/app';
import { ErrorBoundaryProps } from './index.types';

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
const useError = ({ updatePwa }: ErrorBoundaryProps) => {
  const error: { message?: string; data?: string } = useRouteError();

  const { t } = useAppTranslation();

  const handleReload = () => {
    try {
      updatePwa();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await dbAppDelete();
    await userSignOut();

    window.location.href = './';
  };

  return { t, handleReload, handleDelete, error };
};

export default useError;
