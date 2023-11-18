import { useState } from 'react';
import { setIsAccountChoose } from '@services/recoil/app';
import { handleUpdateSetting } from '@services/dexie/settings';

const useAccountChooser = () => {
  const [tmpType, setTmpType] = useState('pocket');

  const handleChoosePocket = () => {
    console.log('pocket');
    setTmpType('pocket');
  };

  const handleChooseVIP = () => {
    console.log('vip');
    setTmpType('vip');
  };

  const handleConfirmOption = async () => {
    await handleUpdateSetting({ account_type: tmpType });
    await setIsAccountChoose(false);
  };

  return { handleConfirmOption, handleChoosePocket, handleChooseVIP, tmpType };
};

export default useAccountChooser;
