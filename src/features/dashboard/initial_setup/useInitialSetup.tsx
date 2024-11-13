import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import useCurrentUser from '@hooks/useCurrentUser';

const useInitialSetup = () => {
  const { isAdmin } = useCurrentUser();

  const settings = useRecoilValue(settingsState);

  const [currentStep, setCurrentStep] = useState(1);

  const open = useMemo(() => {
    const isNew = settings.cong_settings.cong_new ?? false;

    return isNew && isAdmin;
  }, [settings, isAdmin]);

  const handleClose = async () => {
    await dbAppSettingsUpdate({ 'cong_settings.cong_new': false });
  };

  const handleBackStep = () => setCurrentStep(1);

  const handleMoveStep = () => setCurrentStep(2);

  return { open, handleClose, handleMoveStep, currentStep, handleBackStep };
};

export default useInitialSetup;
