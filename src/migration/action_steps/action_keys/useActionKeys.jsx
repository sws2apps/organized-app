import { useMemo, useState } from 'react';
import AccessCode from './access_code';
import MasterKey from './master_key';

const useActionKeys = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => setCurrentStep((prev) => prev + 1);

  const steps = useMemo(() => {
    return [
      <MasterKey next={handleNext} key="master-key" />,
      <AccessCode key="access-code" />,
    ];
  }, []);

  return { steps, currentStep };
};

export default useActionKeys;
