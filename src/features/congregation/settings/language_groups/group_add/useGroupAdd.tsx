import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { LanguageGroupType } from '@definition/settings';
import { circuitNumberState } from '@states/settings';
import { CreateState } from './index.types';

const useGroupAdd = () => {
  const congCircuit = useRecoilValue(circuitNumberState);

  const [step, setStep] = useState<CreateState>('start');
  const [group, setGroup] = useState<LanguageGroupType>({
    id: '',
    _deleted: false,
    language: '',
    name: '',
    circuit: congCircuit,
    admins: [],
    updatedAt: '',
  });

  const handleNext = () => setStep('final');

  const handleBack = () => setStep('start');

  const handleGroupChange = (value: LanguageGroupType) => {
    setGroup(value);
  };

  return { step, handleNext, handleBack, group, handleGroupChange };
};

export default useGroupAdd;
