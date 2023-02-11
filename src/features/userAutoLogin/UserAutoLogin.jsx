import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { deleteDb } from '../../indexedDb/dbUtility';
import {
  congAccountConnectedState,
  congIDState,
  isAdminCongState,
  pocketMembersState,
} from '../../states/congregation';
import {
  apiHostState,
  isAppLoadState,
  isOnlineState,
  rootModalOpenState,
  userIDState,
  visitorIDState,
} from '../../states/main';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const UserAutoLogin = () => {
  let abortCont = useMemo(() => new AbortController(), []);

  const { isAuthenticated, user } = useFirebaseAuth();

  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setPocketMembers = useSetRecoilState(pocketMembersState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const isAppLoad = useRecoilValue(isAppLoadState);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    await deleteDb();
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
        if (data.cong_role.includes('lmmo') || data.cong_role.includes('lmmo-backup')) {
          setCongAccountConnected(true);
          setCongID(data.cong_id);
          setUserID(data.id);

          // role admin
          if (data.cong_role.includes('admin')) {
            setIsAdminCong(true);
          }

          const { cong_name, cong_number, pocket_members, username } = data;
          let obj = {};
          obj.username = username;
          obj.cong_name = cong_name;
          obj.cong_number = cong_number;
          obj.pocket_members = pocket_members;
          await dbUpdateAppSettings(obj);
          setPocketMembers(pocket_members);
          return;
        }

        // role disapproved
        await handleDisapproved();
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
    user,
  ]);

  useEffect(() => {
    if (!isAppLoad && isOnline && isAuthenticated) {
      checkLogin();
    } else {
      setCongAccountConnected(false);
      setIsAdminCong(false);
    }
  }, [isAppLoad, isAuthenticated, checkLogin, isOnline, setCongAccountConnected, setIsAdminCong]);

  return <></>;
};

export default UserAutoLogin;
