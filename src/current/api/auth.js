import { getAuth } from 'firebase/auth';
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { initAppDb, isDbExist } from '../indexedDb/dbUtility';
import { congIDState, congRoleState, isAdminCongState, userMembersDelegateState } from '../states/congregation';
import {
  accountTypeState,
  isOAuthAccountUpgradeState,
  qrCodePathState,
  secretTokenPathState,
  userIDState,
  userLocalUidState,
} from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { loadApp } from '../utils/app';
import { getProfile } from './common';
import backupWorkerInstance from '../workers/backupWorker';
import { Setting } from '../classes/Setting';
import { Persons } from '../classes/Persons';
import { UserS4Records } from '../classes/UserS4Records';

export const apiSendAuthorization = async () => {
  try {
    const { apiHost, isOnline, visitorID } = await getProfile();

    if (isOnline && apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
        },
        body: JSON.stringify({ visitorid: visitorID }),
      });
      const data = await res.json();

      if (res.status === 200) {
        const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate, user_local_uid, mfa } = data;

        if (mfa === 'not_enabled') {
          if (cong_name.length === 0) return { createCongregation: true };

          if (cong_role.length === 0) return { unauthorized: true };

          const approvedRole =
            cong_role.includes('lmmo') ||
            cong_role.includes('lmmo-backup') ||
            cong_role.includes('view_meeting_schedule') ||
            cong_role.includes('admin') ||
            cong_role.includes('secretary') ||
            cong_role.includes('coordinator') ||
            cong_role.includes('public_talk_coordinator') ||
            cong_role.includes('elder') ||
            cong_role.includes('publisher') ||
            cong_role.includes('ms');

          if (!approvedRole) return { unauthorized: true };

          backupWorkerInstance.setUserRole(cong_role);
          backupWorkerInstance.setCongID(cong_id);
          backupWorkerInstance.setIsCongAccountConnected(true);
          backupWorkerInstance.setAccountType('vip');

          await promiseSetRecoil(congIDState, cong_id);

          if (cong_role.includes('admin')) {
            await promiseSetRecoil(isAdminCongState, true);
          }

          const isMainDb = await isDbExist('cpe_sws');
          if (!isMainDb) await initAppDb();

          // save congregation update if any
          let obj = {};
          obj.username = data.username;
          obj.cong_name = cong_name;
          obj.cong_number = cong_number;
          obj.isLoggedOut = false;
          obj.user_members_delegate = user_members_delegate;

          if (user_local_uid && user_local_uid !== null) {
            obj.user_local_uid = user_local_uid;
            await promiseSetRecoil(userLocalUidState, user_local_uid);
          }

          obj.cong_role = cong_role;
          obj.account_type = 'vip';
          await Setting.update(obj);

          await promiseSetRecoil(userIDState, id);
          await promiseSetRecoil(userMembersDelegateState, user_members_delegate);
          await promiseSetRecoil(accountTypeState, 'vip');
          await promiseSetRecoil(congRoleState, cong_role);

          // update persons if exists
          if (data.cong_persons) {
            await Persons.reset();

            for await (const person of data.cong_persons) {
              await Persons.cleanAdd(person);
            }
          }

          // update user field service reports if exists
          if (data.user_fieldServiceReports) {
            await UserS4Records.mergeFromBackup(data.user_fieldServiceReports);
          }

          await loadApp();

          return { success: true };
        } else {
          return { isVerifyMFA: true };
        }
      } else {
        if (data.secret && data.qrCode) {
          await promiseSetRecoil(secretTokenPathState, data.secret);
          await promiseSetRecoil(qrCodePathState, data.qrCode);
          return { isSetupMFA: true };
        }
        if (data.message) {
          await promiseSetRecoil(appMessageState, data.message);
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
          return {};
        }

        return {};
      }
    }

    return {};
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
  }
};

export const apiHandleVerifyOTP = async (userOTP, isSetup, trustedDevice) => {
  try {
    const { t } = getI18n();

    const { apiHost, visitorID } = await getProfile();

    const auth = await getAuth();
    const user = auth.currentUser;

    if (userOTP.length === 6) {
      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/v2/mfa/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ token: userOTP, trusted: trustedDevice }),
        });

        const data = await res.json();

        if (res.status !== 200) {
          if (data.message) {
            if (data.message === 'TOKEN_INVALID') data.message = t('mfaTokenInvalidExpired', { ns: 'ui' });
            await promiseSetRecoil(appMessageState, data.message);
            await promiseSetRecoil(appSeverityState, 'warning');
            await promiseSetRecoil(appSnackOpenState, true);
            return {};
          }

          if (!isSetup && data.secret) {
            await promiseSetRecoil(secretTokenPathState, data.secret);
            await promiseSetRecoil(qrCodePathState, data.qrCode);
            return { reenroll: true };
          }
        }

        const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate, user_local_uid } = data;

        if (cong_name.length === 0) return { createCongregation: true };

        if (cong_role.length === 0) return { unauthorized: true };

        const approvedRole =
          cong_role.includes('lmmo') ||
          cong_role.includes('lmmo-backup') ||
          cong_role.includes('view_meeting_schedule') ||
          cong_role.includes('admin') ||
          cong_role.includes('secretary') ||
          cong_role.includes('coordinator') ||
          cong_role.includes('public_talk_coordinator') ||
          cong_role.includes('elder') ||
          cong_role.includes('publisher') ||
          cong_role.includes('ms');

        if (!approvedRole) return { unauthorized: true };

        backupWorkerInstance.setUserRole(cong_role);
        backupWorkerInstance.setCongID(cong_id);
        backupWorkerInstance.setIsCongAccountConnected(true);
        backupWorkerInstance.setAccountType('vip');

        await promiseSetRecoil(congIDState, cong_id);

        if (cong_role.includes('admin')) {
          await promiseSetRecoil(isAdminCongState, true);
        }

        const isMainDb = await isDbExist('cpe_sws');
        if (!isMainDb) await initAppDb();

        // save congregation update if any
        let obj = {};
        obj.username = data.username;
        obj.cong_name = cong_name;
        obj.cong_number = cong_number;
        obj.isLoggedOut = false;
        obj.user_members_delegate = user_members_delegate;

        if (user_local_uid && user_local_uid !== null) {
          obj.user_local_uid = user_local_uid;
          await promiseSetRecoil(userLocalUidState, user_local_uid);
        }

        obj.cong_role = cong_role;
        obj.account_type = 'vip';
        await Setting.update(obj);

        await promiseSetRecoil(userIDState, id);
        await promiseSetRecoil(userMembersDelegateState, user_members_delegate);
        await promiseSetRecoil(accountTypeState, 'vip');
        await promiseSetRecoil(congRoleState, cong_role);

        // update persons if exists
        if (data.cong_persons) {
          await Persons.reset();

          for await (const person of data.cong_persons) {
            await Persons.cleanAdd(person);
          }
        }

        // update user field service reports if exists
        if (data.user_fieldServiceReports) {
          await UserS4Records.mergeFromBackup(data.user_fieldServiceReports);
        }

        await loadApp();

        return { success: true };
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiRequestPasswordlesssLink = async (email, uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, appLang } = await getProfile();

    const isOAuthAccountUpgrade = await promiseGetRecoil(isOAuthAccountUpgradeState);

    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/user-passwordless-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          applanguage: appLang,
        },
        body: JSON.stringify({ email, uid }),
      });

      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem('emailForSignIn', email);
        if (isOAuthAccountUpgrade) {
          await promiseSetRecoil(appMessageState, t('oauthAccountUpgradeEmailComplete', { ns: 'ui' }));
        } else {
          await promiseSetRecoil(appMessageState, t('emailAuthSent', { ns: 'ui' }));
        }

        await promiseSetRecoil(appSeverityState, 'success');
        await promiseSetRecoil(appSnackOpenState, true);
        return { isSuccess: true };
      } else {
        if (data.message) {
          await promiseSetRecoil(appMessageState, data.message);
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
          return {};
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, t('sendEmailError', { ns: 'ui' }));
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiUpdatePasswordlessInfo = async (uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, visitorID } = await getProfile();

    if (apiHost !== '') {
      const tmpEmail = localStorage.getItem('emailForSignIn');

      const res = await fetch(`${apiHost}api/v2/user-passwordless-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid,
        },
        body: JSON.stringify({ email: tmpEmail, visitorid: visitorID }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.removeItem('emailForSignIn');

        const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate, user_local_uid, mfa } = data;

        if (mfa === 'not_enabled') {
          if (cong_name.length === 0) return { createCongregation: true };

          if (cong_role.length === 0) return { unauthorized: true };

          const approvedRole =
            cong_role.includes('lmmo') ||
            cong_role.includes('lmmo-backup') ||
            cong_role.includes('view_meeting_schedule') ||
            cong_role.includes('admin') ||
            cong_role.includes('secretary') ||
            cong_role.includes('coordinator') ||
            cong_role.includes('public_talk_coordinator') ||
            cong_role.includes('elder') ||
            cong_role.includes('publisher') ||
            cong_role.includes('ms');

          if (!approvedRole) return { unauthorized: true };

          backupWorkerInstance.setUserRole(cong_role);
          backupWorkerInstance.setCongID(cong_id);
          backupWorkerInstance.setIsCongAccountConnected(true);
          backupWorkerInstance.setAccountType('vip');

          await promiseSetRecoil(congIDState, cong_id);

          if (cong_role.includes('admin')) {
            await promiseSetRecoil(isAdminCongState, true);
          }

          const isMainDb = await isDbExist('cpe_sws');
          if (!isMainDb) await initAppDb();

          // save congregation update if any
          let obj = {};
          obj.username = data.username;
          obj.cong_name = cong_name;
          obj.cong_number = cong_number;
          obj.isLoggedOut = false;
          obj.user_members_delegate = user_members_delegate;

          if (user_local_uid && user_local_uid !== null) {
            obj.user_local_uid = user_local_uid;
            await promiseSetRecoil(userLocalUidState, user_local_uid);
          }

          obj.cong_role = cong_role;
          obj.account_type = 'vip';
          await Setting.update(obj);

          await promiseSetRecoil(userIDState, id);
          await promiseSetRecoil(userMembersDelegateState, user_members_delegate);
          await promiseSetRecoil(accountTypeState, 'vip');
          await promiseSetRecoil(congRoleState, cong_role);

          // update persons if exists
          if (data.cong_persons) {
            await Persons.reset();

            for await (const person of data.cong_persons) {
              await Persons.cleanAdd(person);
            }
          }

          // update user field service reports if exists
          if (data.user_fieldServiceReports) {
            await UserS4Records.mergeFromBackup(data.user_fieldServiceReports);
          }

          await loadApp();

          return { success: true };
        } else {
          return { isVerifyMFA: true, tmpEmail };
        }
      } else {
        if (data.secret && data.qrCode) {
          localStorage.removeItem('emailForSignIn');
          await promiseSetRecoil(secretTokenPathState, data.secret);
          await promiseSetRecoil(qrCodePathState, data.qrCode);
          return { isSetupMFA: true, tmpEmail };
        }
        if (data.message) {
          await promiseSetRecoil(appMessageState, t('verifyEmailError', { ns: 'ui' }));
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
          return {};
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, t('verifyEmailError', { ns: 'ui' }));
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiPocketSignUp = async (code) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
        },
        body: JSON.stringify({ visitorid: visitorID, otp_code: code.toUpperCase() }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiPocketValidate = async () => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/validate-me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchPocketSessions = async () => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/devices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
      });

      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiPocketDeviceDelete = async (pocket_visitorid) => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/devices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
        body: JSON.stringify({ pocket_visitorid }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
