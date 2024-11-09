import { promiseGetRecoil } from 'recoil-outside';
import { getAuth } from 'firebase/auth';
import { apiHostCPEState, congIDCPEState } from '../states/main';

export const apiDefault = async () => {
  const apiHost = await promiseGetRecoil(apiHostCPEState);
  const congID = await promiseGetRecoil(congIDCPEState);

  const appversion = import.meta.env.PACKAGE_VERSION;
  const applanguage = 'en';

  const auth = getAuth();
  const user = auth?.currentUser;

  const userUID = user?.uid;
  const idToken = await user?.getIdToken();

  return {
    apiHost,
    appversion,
    applanguage,
    userUID,
    idToken,
    congID,
  };
};
