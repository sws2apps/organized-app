import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { migrationStepState } from '../states/main';
import ActionKeys from './action_keys';
import ActionLogin from './action_login';
import ActionMigrate from './action_migrate';

const useActionSteps = () => {
  const currentStep = useRecoilValue(migrationStepState);

  const steps = useMemo(() => {
    return [
      {
        label: 'Login to your account',
        Component: <ActionLogin />,
      },
      {
        label: 'Set master key and access code',
        Component: <ActionKeys />,
      },
      {
        label: 'Migrate your data',
        Component: <ActionMigrate />,
      },
    ];
  }, []);

  return { steps, currentStep };
};

export default useActionSteps;
