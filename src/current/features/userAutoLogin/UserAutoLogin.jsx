import { useCallback, useEffect, useMemo } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { deleteAppDb } from '../../indexedDb/dbUtility';
import {
  congAccountConnectedState,
  congIDState,
  congRoleState,
  isAdminCongState,
  userMembersDelegateState,
} from '../../states/congregation';
import {
  apiHostState,
  isAppLoadState,
  isOAuthAccountUpgradeState,
  isOnlineState,
  rootModalOpenState,
  userIDState,
  userLocalUidState,
  visitorIDState,
} from '../../states/main';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import backupWorkerInstance from '../../workers/backupWorker';
import { Setting } from '../../classes/Setting';
import { apiFetchSchedule } from '../../api';
import { Persons } from '../../classes/Persons';
import { UserS4Records } from '../../classes/UserS4Records';

const UserAutoLogin = () => {
  let abortCont = useMemo(() => new AbortController(), []);

  const { isAuthenticated, user } = useFirebaseAuth();

  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setUserDelegate = useSetRecoilState(userMembersDelegateState);
  const setCongRole = useSetRecoilState(congRoleState);
  const setUserLocalUid = useSetRecoilState(userLocalUidState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOAuthAccountUpgrade = useRecoilValue(isOAuthAccountUpgradeState);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    await deleteAppDb();
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem('email');
    window.location.href = './';
  }, [setModalOpen]);

  const checkLogin = useCallback(async () => {
    try {
      if (isAuthenticated && apiHost !== '' && visitorID !== '') {
        const res = await fetch(`${apiHost}api/v2/users/validate-me`, {
          signal: abortCont.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        const data = await res.json();

        // congregation found
        if (res.status === 200) {
          const approvedRole =
            data.cong_role.includes('lmmo') ||
            data.cong_role.includes('lmmo-backup') ||
            data.cong_role.includes('view_meeting_schedule') ||
            data.cong_role.includes('admin') ||
            data.cong_role.includes('secretary') ||
            data.cong_role.includes('coordinator') ||
            data.cong_role.includes('public_talk_coordinator') ||
            data.cong_role.includes('elder') ||
            data.cong_role.includes('publisher') ||
            data.cong_role.includes('ms');

          // role approved
          if (approvedRole) {
            setCongAccountConnected(true);

            backupWorkerInstance.setUserRole(data.cong_role);
            backupWorkerInstance.setCongID(data.cong_id);
            backupWorkerInstance.setIsCongAccountConnected(true);
            backupWorkerInstance.setAccountType('vip');

            setCongID(data.cong_id);
            setUserID(data.id);
            setCongRole(data.cong_role);

            // role admin
            if (data.cong_role.includes('admin')) {
              setIsAdminCong(true);
            }

            const { cong_name, cong_number, cong_role, user_members_delegate, user_local_uid, username } = data;
            let obj = {};
            obj.username = username;
            obj.cong_name = cong_name;
            obj.cong_number = cong_number;
            obj.user_members_delegate = user_members_delegate;

            if (user_local_uid && user_local_uid !== null) {
              obj.user_local_uid = user_local_uid;
              setUserLocalUid(user_local_uid);
            }

            obj.cong_role = cong_role;
            obj.account_type = 'vip';
            await Setting.update(obj);
            setUserDelegate(user_members_delegate);

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

            // update schedule
            await apiFetchSchedule();
            return;
          }

          // role disapproved
          await handleDisapproved();
          return;
        }

        if (res.status === 403) {
          const auth = getAuth();
          await signOut(auth);
          return;
        }

        // congregation not found
        if (res.status === 404) {
          // user not authorized and delete local data
          await handleDisapproved();
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    apiHost,
    abortCont,
    handleDisapproved,
    isAuthenticated,
    visitorID,
    setCongAccountConnected,
    setCongID,
    setIsAdminCong,
    setUserDelegate,
    setUserID,
    setCongRole,
    user,
    setUserLocalUid,
  ]);

  useEffect(() => {
    if (!isOAuthAccountUpgrade && !isAppLoad && isOnline && isAuthenticated) {
      checkLogin();
    } else {
      setCongAccountConnected(false);
      setIsAdminCong(false);
    }
  }, [
    isAppLoad,
    isAuthenticated,
    isOAuthAccountUpgrade,
    checkLogin,
    isOnline,
    setCongAccountConnected,
    setIsAdminCong,
  ]);

  return <></>;
};

export default UserAutoLogin;
