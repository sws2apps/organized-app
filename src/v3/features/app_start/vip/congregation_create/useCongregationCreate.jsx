import { useEffect, useRef, useState } from 'react';
import backupWorkerInstance from '@services/worker/backupWorker';
import { useAppTranslation, useFirebaseAuth } from '@hooks';
import {
  displaySnackNotification,
  setCongAccountConnected,
  setCongID,
  setIsAppLoad,
  setIsSetup,
  setOfflineOverride,
  setUserID,
  setIsUserSignIn,
  setIsCongAccountCreate,
} from '@services/recoil/app';
import { apiCreateCongregation } from '@services/api/congregation';
import { handleUpdateSetting } from '@services/dexie/settings';
import { loadApp, runUpdater } from '@services/cpe';

const useCongregationCreate = () => {
  const cancel = useRef();
  const { user } = useFirebaseAuth();

  const { t } = useAppTranslation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState(null);
  const [congregation, setCongregation] = useState(null);
  const [role, setRole] = useState('');
  const [userTmpFullname, setUserTmpFullname] = useState('');
  const [isCreate, setIsCreate] = useState(false);

  const handleCongregationAction = async () => {
    try {
      if (userTmpFullname.length === 0 || country === null || congregation === null || role.length === 0) {
        await displaySnackNotification({
          message: t('missingInfo'),
          severity: 'warning',
        });

        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);

      const { status, data } = await apiCreateCongregation(
        country.code,
        congregation.congName,
        congregation.congNumber,
        role,
        userTmpFullname
      );

      if (status !== 200 && status !== 404) {
        await displaySnackNotification({
          message: data.message,
          severity: 'warning',
        });

        setIsProcessing(false);
        return;
      }

      if (status === 404) {
        await displaySnackNotification({
          message: t('congregationExists'),
          severity: 'warning',
        });

        setIsProcessing(false);
        return;
      }

      if (status === 200) {
        const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate } = data;

        setCongID(cong_id);
        backupWorkerInstance.setCongID(cong_id);

        let obj = {};
        obj.username = data.username;
        obj.cong_name = cong_name;
        obj.cong_number = cong_number;
        obj.user_members_delegate = user_members_delegate;
        obj.cong_role = cong_role;

        await handleUpdateSetting(obj);

        setUserID(id);

        await loadApp();

        setIsSetup(false);

        await runUpdater();
        setTimeout(() => {
          setOfflineOverride(false);
          setCongAccountConnected(true);
          setIsAppLoad(false);
        }, [2000]);
      }
    } catch (err) {
      if (!cancel.current) {
        await displaySnackNotification({
          message: err.message,
          severity: 'error',
        });

        setIsProcessing(false);
      }
    }
  };

  const handleSignIn = async () => {
    await setIsUserSignIn(true);
    await setIsCongAccountCreate(false);
    await setCongAccountConnected(false);
  };

  useEffect(() => {
    if (user) {
      if (user.displayName && user.displayName !== null) {
        setUserTmpFullname(user.displayName);
        return;
      }

      if (
        user.displayName === null &&
        user.providerData[0]?.displayName &&
        user.providerData[0]?.displayName !== null
      ) {
        setUserTmpFullname(user.providerData[0].displayName);
        return;
      }

      setUserTmpFullname('');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return {
    handleSignIn,
    country,
    congregation,
    role,
    userTmpFullname,
    isCreate,
    isProcessing,
    handleCongregationAction,
    setIsCreate,
    setRole,
    setCongregation,
    setCountry,
    setUserTmpFullname,
  };
};

export default useCongregationCreate;
