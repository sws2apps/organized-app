import { promiseGetRecoil } from 'recoil-outside';
import {
  apiHostState,
  appLangState,
  congIDState,
  isOnlineState,
  userIDState,
} from '@states/app';
import { JWLangState } from '@states/settings';
import { currentAuthUser } from '@services/firebase/auth';

export const apiDefault = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const appVersion = import.meta.env.PACKAGE_VERSION;
  const appLang = await promiseGetRecoil(appLangState);
  const congID = await promiseGetRecoil(congIDState);
  const isOnline = await promiseGetRecoil(isOnlineState);
  const JWLang = await promiseGetRecoil(JWLangState);
  const userID = await promiseGetRecoil(userIDState);

  const userUID = currentAuthUser()?.uid;
  const idToken = await currentAuthUser()?.getIdToken();

  return {
    apiHost,
    appVersion,
    userUID,
    appLang,
    congID,
    isOnline,
    JWLang,
    userID,
    idToken,
  };
};
