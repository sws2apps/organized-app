import useActionKeys from './useActionKeys';

const ActionKeys = () => {
  const { currentStep, steps } = useActionKeys();

  return <>{steps[currentStep]}</>;
};

export default ActionKeys;
