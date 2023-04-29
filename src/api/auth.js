import { getAuth } from 'firebase/auth';
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { initAppDb, isDbExist } from '../indexedDb/dbUtility';
import { congIDState, congRoleState, isAdminCongState, pocketMembersState } from '../states/congregation';
import {
  accountTypeState,
  isOAuthAccountUpgradeState,
  qrCodePathState,
  secretTokenPathState,
  userIDState,
} from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { loadApp } from '../utils/app';
import { getProfile } from './common';
import backupWorkerInstance from '../workers/backupWorker';
import { Setting } from '../classes/Setting';

export const apiSendAuthorization = async () => {
  try {
    const { apiHost, isOnline, visitorID } = await getProfile();

    if (isOnline && apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          uid: user.uid,
        },
        body: JSON.stringify({ visitorid: visitorID }),
      });
      const data = await res.json();

      if (res.status === 200) {
        return { isVerifyMFA: true };
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
        const res = await fetch(`${apiHost}api/mfa/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

        const { id, cong_id, cong_name, cong_role, cong_number, pocket_members, pocket_local_id } = data;

        if (cong_name.length === 0) return { createCongregation: true };

        if (cong_role.length === 0) return { unauthorized: true };

        if (
          !cong_role.includes('lmmo') &&
          !cong_role.includes('lmmo-backup') &&
          !cong_role.includes('view_meeting_schedule') &&
          !cong_role.includes('secretary')
        )
          return { unauthorized: true };

        backupWorkerInstance.setUserRole(cong_role);
        backupWorkerInstance.setCongID(cong_id);
        backupWorkerInstance.setIsCongAccountConnected(true);

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
        obj.pocket_members = pocket_members;
        obj.pocket_local_id = pocket_local_id;
        obj.cong_role = cong_role;
        obj.account_type = 'vip';
        await Setting.update(obj);

        await promiseSetRecoil(userIDState, id);
        await promiseSetRecoil(pocketMembersState, pocket_members);
        await promiseSetRecoil(accountTypeState, 'vip');
        await promiseSetRecoil(congRoleState, cong_role);

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

export const apiHandleVerifyEmailOTP = async (userOTP) => {
  try {
    const { t } = getI18n();

    const { apiHost, visitorID } = await getProfile();

    const auth = await getAuth();
    const user = auth.currentUser;

    if (userOTP.length === 6) {
      if (apiHost !== '') {
        const res = await fetch(`${apiHost}verify-otp-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ code: userOTP }),
        });

        const data = await res.json();

        if (res.status !== 200) {
          if (data.message) {
            if (data.message === 'TOKEN_INVALID') data.message = t('mfaTokenInvalidExpired', { ns: 'ui' });
            if (data.message === 'EMAIL_OTP_INVALID') data.message = t('emailOTPInvalidExpired', { ns: 'ui' });
            await promiseSetRecoil(appMessageState, data.message);
            await promiseSetRecoil(appSeverityState, 'warning');
            await promiseSetRecoil(appSnackOpenState, true);
            return {};
          }
        }

        const { id, cong_id, cong_name, cong_role, cong_number, pocket_members } = data;

        if (cong_name.length === 0) return { createCongregation: true };

        if (cong_role.length === 0) return { unauthorized: true };

        if (!cong_role.includes('lmmo') && !cong_role.includes('lmmo-backup')) return { unauthorized: true };

        backupWorkerInstance.setCongID(cong_id);
        backupWorkerInstance.setIsCongAccountConnected(true);

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
        obj.pocket_members = pocket_members;
        obj.cong_role = cong_role;
        obj.account_type = 'vip';
        await Setting.update(obj);

        await promiseSetRecoil(userIDState, id);
        await promiseSetRecoil(pocketMembersState, pocket_members);
        await promiseSetRecoil(accountTypeState, 'vip');
        await promiseSetRecoil(congRoleState, cong_role);

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

export const apiRequestTempOTPCode = async (uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, appLang, visitorID } = await getProfile();

    if (apiHost !== '' && uid !== '') {
      const res = await fetch(`${apiHost}request-otp-code`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          applanguage: appLang,
          uid: uid,
          visitorid: visitorID,
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        return { success: true };
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

export const apiRequestPasswordlesssLink = async (email, uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, appLang } = await getProfile();

    const isOAuthAccountUpgrade = await promiseGetRecoil(isOAuthAccountUpgradeState);

    if (apiHost !== '') {
      const res = await fetch(`${apiHost}user-passwordless-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      const res = await fetch(`${apiHost}user-passwordless-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          uid,
        },
        body: JSON.stringify({ email: tmpEmail, visitorid: visitorID }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.removeItem('emailForSignIn');
        return { isVerifyMFA: true, tmpEmail };
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
      const res = await fetch(`${apiHost}api/sws-pocket/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const res = await fetch(`${apiHost}api/sws-pocket/validate-me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
