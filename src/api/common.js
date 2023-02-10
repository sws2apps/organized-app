import { promiseGetRecoil } from 'recoil-outside';
import { apiHostState, appLangState, sourceLangState, userEmailState, visitorIDState } from '../states/main';

export const getProfile = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const userEmail = await promiseGetRecoil(userEmailState);
  const visitorID = await promiseGetRecoil(visitorIDState);
  const appLang = await promiseGetRecoil(appLangState);
  const sourceLang = await promiseGetRecoil(sourceLangState);

  return { apiHost, appLang, userEmail, visitorID, sourceLang };
};
