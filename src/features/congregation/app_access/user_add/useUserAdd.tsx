import { useState } from 'react';
import { CurrentStepType, UserType } from './index.types';

const useUserAdd = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>('select');
  const [user, setUser] = useState<UserType>({ name: '', code: '' });

  const handleMoveStep = () => setCurrentStep('share');

  const handleSetUser = (name: string, code: string) => {
    setUser({ name, code });
  };

  return { currentStep, handleMoveStep, handleSetUser, user };
};

export default useUserAdd;
