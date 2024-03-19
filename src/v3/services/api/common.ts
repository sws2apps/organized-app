import { promiseGetRecoil } from 'recoil-outside';
import {
  JWLangState,
  apiHostState,
  appLangState,
  congIDState,
  isOnlineState,
  userIDState,
  visitorIDState,
} from '@states/app';
import { currentAuthUser } from '@services/firebase/auth';

export const apiDefault = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const visitorID = await promiseGetRecoil(visitorIDState);
  const appVersion = import.meta.env.PACKAGE_VERSION;
  const appLang = await promiseGetRecoil(appLangState);
  const congID = await promiseGetRecoil(congIDState);
  const isOnline = await promiseGetRecoil(isOnlineState);
  const JWLang = await promiseGetRecoil(JWLangState);
  const userID = await promiseGetRecoil(userIDState);

  const userUID = currentAuthUser()?.uid;

  return { apiHost, visitorID, appVersion, userUID, appLang, congID, isOnline, JWLang, userID };
};
