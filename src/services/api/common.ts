import { store } from '@states/index';
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
  const apiHost = store.get(apiHostState);
  const appVersion = import.meta.env.PACKAGE_VERSION;
  const appLang = store.get(appLangState);
  const congID = store.get(congIDState);
  const isOnline = store.get(isOnlineState);
  const JWLang = store.get(JWLangState);
  const userID = store.get(userIDState);

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
