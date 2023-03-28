import { useCallback, useEffect, useMemo } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { deleteAppDb } from '../../indexedDb/dbUtility';
import {
  congAccountConnectedState,
  congIDState,
  congRoleState,
  isAdminCongState,
  pocketMembersState,
} from '../../states/congregation';
import {
  apiHostState,
  isAppLoadState,
  isOAuthAccountUpgradeState,
  isOnlineState,
  rootModalOpenState,
  userIDState,
  visitorIDState,
} from '../../states/main';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import backupWorkerInstance from '../../workers/backupWorker';
import { Setting } from '../../classes/Setting';
import { apiFetchSchedule } from '../../api';

const UserAutoLogin = () => {
  let abortCont = useMemo(() => new AbortController(), []);

  const { isAuthenticated, user } = useFirebaseAuth();

  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setPocketMembers = useSetRecoilState(pocketMembersState);
  const setCongRole = useSetRecoilState(congRoleState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOAuthAccountUpgrade = useRecoilValue(isOAuthAccountUpgradeState);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    await deleteAppDb();
    localStorage.removeItem('email');
    window.location.href = './';
  }, [setModalOpen]);

  const checkLogin = useCallback(async () => {
    if (isAuthenticated && apiHost !== '' && visitorID !== '') {
      const res = await fetch(`${apiHost}api/users/validate-me`, {
        signal: abortCont.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      const data = await res.json();

      // congregation found
      if (res.status === 200) {
        // role approved
        if (
          data.cong_role.includes('lmmo') ||
          data.cong_role.includes('lmmo-backup') ||
          data.cong_role.includes('view_meeting_schedule')
        ) {
          setCongAccountConnected(true);
          if (data.cong_role.includes('lmmo') || data.cong_role.includes('lmmo-backup')) {
            backupWorkerInstance.setRoleApproved(true);
          } else {
            backupWorkerInstance.setRoleApproved(false);
          }
          backupWorkerInstance.setCongID(data.cong_id);
          backupWorkerInstance.setIsCongAccountConnected(true);
          setCongID(data.cong_id);
          setUserID(data.id);
          setCongRole(data.cong_role);

          // role admin
          if (data.cong_role.includes('admin')) {
            setIsAdminCong(true);
          }

          const { cong_name, cong_number, cong_role, pocket_members, pocket_local_id, username } = data;
          let obj = {};
          obj.username = username;
          obj.cong_name = cong_name;
          obj.cong_number = cong_number;
          obj.pocket_members = pocket_members;
          obj.pocket_local_id = pocket_local_id;
          obj.cong_role = cong_role;
          obj.account_type = 'vip';
          await Setting.update(obj);
          setPocketMembers(pocket_members);
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
  }, [
    apiHost,
    abortCont,
    handleDisapproved,
    isAuthenticated,
    visitorID,
    setCongAccountConnected,
    setCongID,
    setIsAdminCong,
    setPocketMembers,
    setUserID,
    setCongRole,
    user,
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
