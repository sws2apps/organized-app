import { handleUpdateSetting } from '@services/dexie/settings';
import { setIsAccountChoose, setIsUserSignIn, setIsUserSignUp } from '@services/recoil/app';

const useSignin = () => {
  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  const handleSignUp = () => {
    setIsUserSignUp(true);
    setIsUserSignIn(false);
  };

  return { handleSignUp, handleReturnChooser };
};

export default useSignin;
